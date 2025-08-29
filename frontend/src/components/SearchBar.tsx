import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
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
    const params = new URLSearchParams(location.search);

    params.delete("q");

    queries.forEach((query) => {
      if (query.trim()) params.append("q", query.trim());
    });

    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
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
        placeholder="Paste multiple course descriptions"
        className="w-full max-w-2xl h-32 text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm"
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
