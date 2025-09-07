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

      <div className="fixed inset-x-0 bottom-0 z-40">
        <div className="mx-auto max-w-5xl">
          <div className="m-4 rounded-xl bg-white/80 backdrop-blur shadow-lg ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
              <ol className="grid w-full grid-cols-1 gap-3 text-sm text-gray-700 md:grid-cols-3">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">1</span>
                  <div>
                    <p className="font-semibold text-gray-900">Paste descriptions</p>
                    <p className="text-gray-600">Drop in one or more course paragraphs.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">2</span>
                  <div>
                    <p className="font-semibold text-gray-900">We compare</p>
                    <p className="text-gray-600">Your text is matched against our database.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">3</span>
                  <div>
                    <p className="font-semibold text-gray-900">See results</p>
                    <p className="text-gray-600">Review the most similar courses instantly.</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      {/* end bottom bar */}
    </div>
  );
};

export default Home;
