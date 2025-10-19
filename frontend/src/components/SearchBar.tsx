import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
  targetPath?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ targetPath }) =>{
  const location = useLocation();
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState<string>("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const allQ = params.getAll("q");
    setQueryText(allQ.map((q) => `"${q}"`).join(" "));
  }, [location.search]);

  const onSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const params = new URLSearchParams();

  // capture all quoted parts
  const matches = [...queryText.matchAll(/"([^"]*?)"(?=\s|$)/g)].map((m) => m[1]);
  const lines = queryText
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Pair each description line with its title (if any)
  lines.forEach((line, index) => {
    const q = matches[index] ? line : line; // keep whole line as query
    params.append("q", q);

    // Send separate title param per query index
    if (matches[index] && matches[index].trim()) {
      params.append(`title${index}`, matches[index].trim());
    }
  });

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
