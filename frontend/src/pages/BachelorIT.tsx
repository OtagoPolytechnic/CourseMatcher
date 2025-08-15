import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";

interface Course {
  id: number;
  course_title: string;
  description: string;
  credits: number;
  year: number;
  sms_code: string;
  program: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/courses/")
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch courses:", error);
        setLoading(false);
      });
  }, []);

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
      <div className="min-h-screen w-full overflow-x-hidden bg-white/70 px-4 py-16 space-y-8">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center mb-10 drop-shadow-sm mb-6">
          Bachelor of Information Technology Courses
        </h1>

        <div className="max-w-2xl mx-auto w-full px-4 mb-8">
          <SearchBar />
        </div>

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto px-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200 ease-in-out p-6 border border-gray-100 flex flex-col justify-between"
            >
              <h2 className="text-xl font-bold text-blue-800 text-center mb-4 min-h-[3rem]">
                {course.course_title}
              </h2>

              <p className="text-gray-700 text-sm mb-6">{course.description}</p>

              <div className="text-sm text-gray-600 space-y-1 mt-auto">
                <p>
                  <span className="font-semibold text-blue-700">Credits:</span>{" "}
                  {course.credits}
                </p>
                <p>
                  <span className="font-semibold text-blue-700">Year:</span>{" "}
                  {course.year}
                </p>
                <p>
                  <span className="font-semibold text-blue-700">SMS Code:</span>{" "}
                  {course.sms_code}
                </p>
                <p>
                  <span className="font-semibold text-blue-700">Program:</span>{" "}
                  {course.program}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseList;
