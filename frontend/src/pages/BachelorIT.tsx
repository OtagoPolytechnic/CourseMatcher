import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../components/SearchBar";
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

const getEmojiFromScore = (score: number): string => {
  if (score > 0.7) return "🟢";
  if (score >= 0.5) return "🟠";
  return "🔴";
};

const CourseList: React.FC = () => {
  const [coursesByQuery, setCoursesByQuery] = useState<
    Record<string, Course[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const location = useLocation();
  const queries = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.getAll("q");
  }, [location.search]);

  useEffect(() => {
    let abort = false;

    async function load() {
      try {
        setLoading(true);

        if (queries.length === 0) {
          const res = await fetch(`${API_BASE}/courses/`);
          const data = await res.json();
          if (!abort) setCoursesByQuery({ All: data.courses ?? [] });
          return;
        }

        const results: Record<string, Course[]> = {};

        for (const q of queries) {
          const url = new URL(`${API_BASE}/search/`);
          url.searchParams.set("q", q);
          url.searchParams.set("k", "6");

          const res = await fetch(url.toString());
          if (!res.ok) {
            console.error(`Search failed for query: ${q}`);
            continue;
          }

          const data = await res.json();
          results[q] = (data.results ?? []).slice(0, 6);

          results[q].forEach((course: Course) => {
            const score = course.similarity ?? 0;
            let label = "";
            if (score > 0.7) label = "Green";
            else if (score >= 0.5) label = "Orange";
            else label = "Red";
            console.log(`${course.course_title}: ${score.toFixed(4)} → ${label}`);
          });
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

        <div className="max-w-2xl mx-auto w-full px-4 mb-8">
          <SearchBar />
        </div>

        {Object.entries(coursesByQuery).map(([query, courses]) => (
          <div key={query} className="mb-10">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4 items-stretch">
              {courses.map((course) => {
                const key = `${query}-${course.sms_code}`;
                const isExpanded = expandedId === key;

                return (
                  <div
                    key={key}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out p-6 border border-gray-100 flex flex-col justify-between"
                  >
                    <h2 className="text-xl font-bold text-blue-800 text-center mb-4 min-h-[3rem]">
                      {course.similarity !== undefined
                        ? getEmojiFromScore(course.similarity) + " "
                        : ""}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
