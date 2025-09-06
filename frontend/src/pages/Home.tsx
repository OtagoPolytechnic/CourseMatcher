import React from "react";
import SearchBar from "../components/SearchBar";

const Home: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/appBackground.jpg')" }}
    >
      <div className="min-h-screen w-full bg-white/70 px-4 py-16 space-y-8 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-blue-700 text-center drop-shadow-sm mb-6">
          Welcome to Course Matcher
        </h1>


        <div className="max-w-2xl w-full px-4">
          <SearchBar targetPath="/it" />
        </div>
      </div>
    </div>
  );
};

export default Home;
