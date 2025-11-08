// =============================================================
// File: BachelorDesign.tsx
// Author: Krittapas2004
// Project: CourseMatcher
// Description:
//   Renders Design course matches.
//   Fetches either all courses or semantic search results
//   based on `q` query params in the URL.
// =============================================================

import SearchBar from "../components/SearchBar";

const BachelorDesign = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-indigo-700">
        Bachelor of Design
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar />
      </div>
    </div>
  );
};

export default BachelorDesign;