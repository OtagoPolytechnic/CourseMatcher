import React, { useEffect, useState } from 'react';

interface Course {
  id: number;
  course_title: string;
  description: string;
  credits: number;
  level: number;
  sms_code: string;
}

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/courses/')
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch courses:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-lg font-medium">Loading courses...</div>;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 px-4 py-10">
      <h1 className="text-4xl font-extrabold text-indigo-700 text-center mb-10 drop-shadow-sm">
        Otago Polytechnic Courses
      </h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-gray-200 p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
          >
            <h2 className="text-xl font-bold text-indigo-800 mb-2">
              {course.course_title}
            </h2>
            <p className="text-gray-700 text-sm mb-4">{course.description}</p>

            <div className="text-sm space-y-1 text-gray-600 mt-4">
              <p>
                <span className="font-semibold text-indigo-600">Credits:</span> {course.credits}
              </p>
              <p>
                <span className="font-semibold text-indigo-600">Level:</span> {course.level}
              </p>
              <p>
                <span className="font-semibold text-indigo-600">SMS Code:</span> {course.sms_code}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
