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
    <form onSubmit={onSubmit} className="flex flex-col items-center gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search for Courses"
        style={{
          width: "700px",
          height: "40px",
          fontSize: "1rem",
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          boxSizing: "border-box",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "0.5rem 1.5rem",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
