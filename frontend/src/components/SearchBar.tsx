import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SearchBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQ(params.get("q") ?? "");
  }, [location.search]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(location.search);
    if (q.trim()) params.set("q", q.trim());
    else params.delete("q");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col items-center gap-4 w-full px-4"
    >
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for Courses"
        className="w-full max-w-2xl h-10 text-base px-4 py-2 border border-gray-300 rounded-md shadow-sm"
      />
      <button
        type="submit"
        className="px-6 py-2 bg-blue-700 text-white rounded-md text-base hover:bg-blue-800 transition"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
