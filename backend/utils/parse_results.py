import sys
import json
import re
import pdfplumber
import os

def detect_semester_and_exam_type(text):
    # Normalize spaces
    clean_text = " ".join(text.split())
    print(f"[DEBUG] Header snippet: {clean_text[:200]}", flush=True)

    # Regex: tolerate "B.Tech" or "B. Tech"
    match = re.search(
        r"Results\s+of\s+(I{1,3}|IV)\s+B\.?\s*Tech\s+(I{1,2})\s+Semester",
        clean_text,
        re.IGNORECASE,
    )

    semester_map = {"I": "1", "II": "2", "III": "3", "IV": "4"}
    semester = None
    if match:
        year_roman = match.group(1).upper()
        sem_roman = match.group(2).upper()
        semester = f"{semester_map[year_roman]}-{semester_map[sem_roman]}"

    # Exam type detection
    exam_type = "Regular"
    if "Supplementary" in clean_text and "Regular" not in clean_text:
        exam_type = "Supplementary"
    elif "Regular/Supplementary" in clean_text:
        exam_type = "Regular/Supplementary"

    return semester, exam_type


def parse_pdf(pdf_path):
    data_rows = []
    semester, exam_type = None, None

    with pdfplumber.open(pdf_path) as pdf:
        total_pages = len(pdf.pages)
        print(f"[INFO] Total pages in PDF: {total_pages}", flush=True)

        for page_num, page in enumerate(pdf.pages, start=1):
            text = page.extract_text() or ""

            if page_num == 1:
                semester, exam_type = detect_semester_and_exam_type(text)
                print(f"[INFO] Detected Semester: {semester}, Exam Type: {exam_type}", flush=True)

            table = page.extract_table()
            if not table:
                print(f"[WARN] Page {page_num}/{total_pages} → No table found", flush=True)
                continue

            for row in table[1:]:
                if not row or len(row) < 6:
                    continue
                sno, hlno, subcode, subname, internals, grade, *rest = row
                credits = rest[0] if rest else None
                if not hlno or not subcode:
                    continue

                data_rows.append({
                    "sno": sno,
                    "hlno": hlno.strip(),
                    "subcode": subcode.strip(),
                    "subname": subname.strip(),
                    "internals": internals.strip() if internals else None,
                    "grade": grade.strip() if grade else None,
                    "credits": credits.strip() if credits else None
                })

            print(f"[INFO] Processed Page {page_num}/{total_pages}, Rows so far: {len(data_rows)}", flush=True)

    return {
        "meta": {"semester": semester, "exam_type": exam_type},
        "rows": data_rows
    }


if __name__ == "__main__":
    if len(sys.argv) < 3:
        sys.exit(1)

    pdf_path = sys.argv[1]
    output_path = sys.argv[2]

    try:
        result = parse_pdf(pdf_path)

        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False)

        print(f"[INFO] Finished parsing. Total rows: {len(result['rows'])}", flush=True)

    except Exception as e:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump({"error": str(e)}, f, ensure_ascii=False)

        print(f"[ERROR] {str(e)}", flush=True)
        sys.exit(1)
