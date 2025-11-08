// =============================================================
// File: SearchBar.tsx
// Author: Krittapas2004
// Project: CourseMatcher
// Description:
//   Reusable search bar component.
//   Captures user input, syncs it with URL query params,
//   and navigates to the target route for search results.
// =============================================================

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
  targetPath?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ targetPath }) =>{
  const location = useLocation();
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>(""); // Holds textarea content

  useEffect(() => {
    const params = new URLSearchParams(location.search); // When the URL changes, populate the textarea from all `q` query params
    const allQ = params.getAll("q");
    setQueryText(allQ.join("\n"));
  }, [location.search]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    
    // Only add query param if user entered something
    const singleQuery = queryText.trim();
  if (singleQuery.length > 0) {
    params.append("q", singleQuery);
  }
  
  // Use provided targetPath if given, otherwise stay on current path
  const path = targetPath ?? location.pathname;
  navigate(`${path}?${params.toString()}`);
};

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-4 w-full px-4"
    >
      <textarea
        value={queryText}
        onChange={(e) =>
          setQueryText(e.target.value)}
        placeholder="Paste course descriptions here..."
        className="bg-blue-100 w-full max-w-3xl h-48 max-h-[calc(100vh-14rem)] overflow-auto text-lg px-4 py-3 border border-gray-300 rounded-lg shadow-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700"
      />
      <button
        type="submit"
        className="bg-blue-700 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition-colors duration-200"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;