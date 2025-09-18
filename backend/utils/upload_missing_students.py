import sys
import json
import pdfplumber

if len(sys.argv) < 2:
    print(json.dumps([]))
    sys.exit(0)

pdf_path = sys.argv[1]
students = []

with pdfplumber.open(pdf_path) as pdf:
    for page in pdf.pages:
        table = page.extract_table()
        if not table:
            continue
        for row in table[1:]:  # skip header
            if len(row) < 2 or not row[1]:
                continue
            hlno = row[1].strip()
            students.append({
                "htno": hlno,
                "name": row[2].strip() if len(row) > 2 else "",
                "role": "user",
                "results": {}
            })

# Remove duplicates
seen = set()
unique_students = []
for s in students:
    if s["htno"] not in seen:
        seen.add(s["htno"])
        unique_students.append(s)

print(json.dumps(unique_students))
