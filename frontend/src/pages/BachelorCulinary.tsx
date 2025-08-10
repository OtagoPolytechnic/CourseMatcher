import SearchBar from "../components/SearchBar";

const BachelorCulinary = () => {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-indigo-700">
        Bachelor of Culinary
      </h1>

      <div className="max-w-2xl mx-auto">
        <SearchBar />
      </div>
    </div>
  );
};

export default BachelorCulinary;