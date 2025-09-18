import React, { useEffect, useState } from "react";
import axios from "axios";

const ResultsPage = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/results/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setResults(res.data.results || {});
      } catch (err) {
        console.error(err);
        setError("Failed to fetch results");
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading results...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const semesters = Object.keys(results);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
          🎓 My Results
        </h1>

        {semesters.length === 0 ? (
          <p className="text-center text-gray-600">
            No results uploaded yet. Please check later.
          </p>
        ) : (
          semesters.map((sem) => (
            <div
              key={sem}
              className="mb-8 border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-indigo-600 mb-4">
                Semester {sem}
              </h2>

              {/* ✅ Responsive scrollable table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs sm:text-sm md:text-base">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="px-2 sm:px-3 py-2 text-left border">
                        Code
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-left border">
                        Subject
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-center border">
                        Internals
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-center border">
                        Grade
                      </th>
                      <th className="px-2 sm:px-3 py-2 text-center border">
                        Credits
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {results[sem].map((sub, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-2 sm:px-3 py-2 border">
                          {sub.subcode}
                        </td>
                        <td className="px-2 sm:px-3 py-2 border">
                          {sub.subname}
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center border">
                          {sub.internals}
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center border">
                          {sub.grade}
                        </td>
                        <td className="px-2 sm:px-3 py-2 text-center border">
                          {sub.credits}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultsPage;
