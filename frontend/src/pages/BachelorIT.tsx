import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Course {
  id?: number;
  course_title: string;
  description: string;
  credits: number;
  year: number;
  sms_code: string;
  program: string;
  similarity?: number;
}

const SimilarityBadge: React.FC<{ score: number }> = ({ score }) => {
  let label = "Low Match";
  let color = "bg-red-100 text-red-700";

  if (score > 0.7) {
    label = "High Match";
    color = "bg-green-100 text-green-700";
  } else if (score >= 0.5) {
    label = "Medium Match";
    color = "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`ml-2 inline-block px-2 py-1 text-xs font-semibold rounded-full ${color}`}
    >
      {label}
    </span>
  );
};

const SimilarityBar: React.FC<{ score: number }> = ({ score }) => {
  const percentage = Math.round(score * 100);
  let barColor = "bg-red-500";
  if (score > 0.7) barColor = "bg-green-500";
  else if (score >= 0.5) barColor = "bg-yellow-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <div
        className={`${barColor} h-2 rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

const CourseList: React.FC = () => {
  const [coursesByQuery, setCoursesByQuery] = useState<
    Record<string, Course[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const location = useLocation();

  const { queries } = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const rawQueries = params.getAll("q");

    const expanded = rawQueries.flatMap((q) => {
      if (!q) return [];

      let decoded = decodeURIComponent(q).replace(/\+/g, " ").trim();
      decoded = decoded.replace(/['“”]/g, '"');
      decoded = decoded.replace(
        /(^|\s)([A-Z][A-Za-z\s&\-\/()]+?)\s+is\s+(a|an|the)\s+/g,
        (_m, prefix, title, article) => `${prefix}"${title}" is ${article} `
      );
      decoded = decoded.replace(/(?="[^"]+"\s+is\s+)/g, "|||");
      const splitQueries = decoded
        .split("|||")
        .map((part) => part.trim())
        .filter((part) => part.length > 50);

      return splitQueries.length > 1 ? splitQueries : [decoded];
    });

    console.log("Expanded queries:", expanded);
    return { queries: expanded };
  }, [location.search]);

  useEffect(() => {
    let abort = false;

    async function load() {
      try {
        setLoading(true);

        // Show all courses if no query provided
        if (queries.length === 0) {
          const res = await fetch(`${API_BASE}/courses/`);
          const data = await res.json();
          if (!abort) setCoursesByQuery({ All: data.courses ?? [] });
          return;
        }

        const results: Record<string, Course[]> = {};

        const expandedQueries = queries.flatMap((q) => {
          const cleaned = q.replace(/\r/g, "").trim();

          // Split when a new course starts (handles quotes, capitalized titles, or blank lines)
          const parts = cleaned
            .split(
              /(?=(?:^|\n|\s)"[^"]+"\s+is\s+|(?:^|\n)[A-Z][A-Za-z\s\-\(\)]+?\s+is\s+(?:a|an)?\s+)/g
            )
            .map((part) => part.trim())
            .filter((part) => part.length > 50);

          return parts.length > 1 ? parts : [cleaned];
        });

        // Fetch hybrid semantic search for each input
        for (const q of expandedQueries) {
          const url = new URL(`${API_BASE}/search/`);
          url.searchParams.set("q", q);
          url.searchParams.set("k", "6");

          const res = await fetch(url.toString());
          if (!res.ok) {
            console.error(`Search failed for query: ${q}`);
            continue;
          }

          const data = await res.json();

          // Handle new grouped format: { results: { "Course 1": [...], "Course 2": [...] } }
          if (data.results) {
            if (Array.isArray(data.results)) {
              // Old flat array format
              results[q] = data.results.slice(0, 3);
            } else if (typeof data.results === "object") {
              // New grouped format: find the first key that matches the query title
              const matchKey = Object.keys(data.results).find((k) =>
                k
                  .toLowerCase()
                  .includes(
                    q
                      .split(" is ")[0]
                      .replace(/["“”]/g, "")
                      .toLowerCase()
                      .trim()
                  )
              );

              const list = matchKey
                ? (data.results[matchKey] as Course[])
                : (Object.values(data.results)[0] as Course[]);

              results[q] = Array.isArray(list) ? list.slice(0, 3) : [];
            } else {
              console.warn("Unexpected results format:", data.results);
            }
          }
        }

        if (!abort) {
          setCoursesByQuery(results);
          setExpandedId(null);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        if (!abort) setLoading(false);
      }
    }

    load();
    return () => {
      abort = true;
    };
  }, [queries]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        <span className="ml-4 text-lg font-medium text-indigo-700">
          Loading courses...
        </span>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/appBackground.jpg')" }}
    >
      <div className="min-h-screen w-full bg-white/70 px-4 py-16 space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center drop-shadow-sm mb-6">
          Bachelor of Information Technology Courses
        </h1>

        {queries.length === 0 ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Matches for:{" "}
              <span className="text-blue-700 font-semibold">All</span>
            </h2>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto items-stretch">
              {coursesByQuery["All"]?.map((course) => {
                const key = `All-${course.sms_code}`;
                const isExpanded = expandedId === key;

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out p-6 border border-gray-100 flex flex-col justify-between"
                  >
                    <h2 className="text-xl font-bold text-blue-800 text-center mb-4 min-h-[3rem]">
                      {course.course_title}
                    </h2>

                    <p
                      className={`text-gray-700 text-sm mb-4 ${
                        !isExpanded ? "line-clamp-5" : ""
                      }`}
                    >
                      {course.description}
                    </p>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : key)}
                      className="inline-block bg-blue-100 text-blue-700 font-semibold text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-all duration-200 mb-4"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>

                    <div className="text-sm text-gray-600 space-y-1 mt-auto">
                      <p>
                        <span className="font-semibold text-blue-700">
                          Credits:
                        </span>{" "}
                        {course.credits}
                      </p>
                      <p>
                        <span className="font-semibold text-blue-700">
                          Year:
                        </span>{" "}
                        {course.year}
                      </p>
                      <p>
                        <span className="font-semibold text-blue-700">
                          SMS Code:
                        </span>{" "}
                        {course.sms_code}
                      </p>
                      <p>
                        <span className="font-semibold text-blue-700">
                          Program:
                        </span>{" "}
                        {course.program}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          queries.map((queryText, index) => {
            const courses = coursesByQuery[queryText] || [];
            const cleanQuery = decodeURIComponent(queryText || "").trim();
            const quotedMatch = cleanQuery.match(/"([^"]+)"|'([^']+)'/);
            
            const extractedTitle = quotedMatch
              ? quotedMatch[1] || quotedMatch[2]
              : cleanQuery.split(" is ")[0].trim();
            const topMatch = courses.length > 0 ? courses[0] : null;
            const looksLikeDescription =
              cleanQuery.split(" ").length > 20 || /[\.,;:]/.test(cleanQuery);

            let displayTitle = "";
            if (quotedMatch) {
              displayTitle = extractedTitle;
            } else if (!looksLikeDescription && extractedTitle.length > 3) {
              displayTitle = extractedTitle;
            } else if (topMatch?.course_title) {
              displayTitle = topMatch.course_title;
            } else {
              displayTitle = cleanQuery;
            }

            return (
              <div key={index} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Matches for:{" "}
                  <span className="text-blue-700 font-semibold">
                    {displayTitle}
                  </span>
                </h2>

                {courses.length === 0 ? (
                  <p className="text-center text-gray-600">
                    No matches found for this course.
                  </p>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto items-stretch">
                    {courses.map((course) => {
                      const key = `${displayTitle}-${course.sms_code}`;
                      const isExpanded = expandedId === key;
                      const score = course.similarity ?? 0;

                      return (
                        <div
                          key={key}
                          className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out p-6 border border-gray-100 flex flex-col justify-between"
                        >
                          <h2 className="text-xl font-bold text-blue-800 text-center mb-4 min-h-[1rem]">
                            {course.course_title}
                          </h2>

                          {course.similarity !== undefined && (
                            <div className="flex flex-col items-center mb-3">
                              <SimilarityBadge score={score} />
                              <div className="w-full mt-1">
                                <SimilarityBar score={score} />
                              </div>
                            </div>
                          )}

                          <p
                            className={`text-gray-700 text-sm mb-4 ${
                              !isExpanded ? "line-clamp-5" : ""
                            }`}
                          >
                            {course.description}
                          </p>

                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : key)
                            }
                            className="inline-block bg-blue-100 text-blue-700 font-semibold text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition-all duration-200 mb-4"
                          >
                            {isExpanded ? "Show Less" : "Read More"}
                          </button>

                          <div className="text-sm text-gray-600 space-y-1 mt-auto">
                            <p>
                              <span className="font-semibold text-blue-700">
                                Credits:
                              </span>{" "}
                              {course.credits}
                            </p>
                            <p>
                              <span className="font-semibold text-blue-700">
                                Year:
                              </span>{" "}
                              {course.year}
                            </p>
                            <p>
                              <span className="font-semibold text-blue-700">
                                SMS Code:
                              </span>{" "}
                              {course.sms_code}
                            </p>
                            <p>
                              <span className="font-semibold text-blue-700">
                                Program:
                              </span>{" "}
                              {course.program}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CourseList;
