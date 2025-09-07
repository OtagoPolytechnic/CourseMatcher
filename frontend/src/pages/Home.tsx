import React from "react";
import SearchBar from "../components/SearchBar";

const Home: React.FC = () => {
  return (
    <div
      className="min-h-screen w-full bg-cover bg-center"
      style={{ backgroundImage: "url('/appBackground.jpg')" }}
    >
      <div className="min-h-screen w-full bg-white/70 px-4 flex flex-col justify-center items-center space-y-12">
      
 <div className="mx-auto max-w-7xl px-4">
  <div className="flex items-center justify-center gap-4 mb-12">
    <img
      src="/landingIcon.png"
      alt="Course Matcher Icon"
      className="h-64 md:h-72 xl:h-80 object-contain drop-shadow-2xl translate-y-4"
    />
    <h1 className="text-8xl md:text-9xl font-extrabold text-blue-700 drop-shadow-2xl leading-tight tracking-tight whitespace-nowrap">
      Course Matcher
    </h1>
  </div>
</div>



        <div className="max-w-3xl w-full px-6">
          <SearchBar targetPath="/it" />
        </div>
      </div>
    </div>
  );
};

export default Home;
