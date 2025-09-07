import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
  targetPath?: string; 
}

const SearchBar: React.FC<SearchBarProps> = ({ targetPath }) =>{
  const location = useLocation();
  const navigate = useNavigate();
  const [queries, setQueries] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const allQ = params.getAll("q");
    setQueries(allQ.length > 0 ? allQ : []);
  }, [location.search]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    queries.forEach((query) => {
      if (query.trim()) params.append("q", query.trim());
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
        value={queries.join("\n")}
        onChange={(e) =>
          setQueries(
            e.target.value
              .split(/\n/)
              .map((q) => q.trim())
              .filter((q) => q.length > 0)
          )
        }
        placeholder="Paste course descriptions here..."
        className="bg-blue-100 w-full max-w-3xl h-48 text-lg px-4 py-3 border border-gray-300 rounded-lg shadow-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-700"
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
