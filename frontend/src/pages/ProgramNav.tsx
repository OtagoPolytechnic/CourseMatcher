import { useNavigate } from 'react-router-dom';

const ProgramNav: React.FC = () => {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    navigate(e.target.value);
  };

  return (
    <div className="w-full bg-indigo-100 py-4 flex justify-center">
      <select
        className="px-4 py-2 rounded border border-indigo-300 text-indigo-700"
        onChange={handleChange}
      >
        <option value="/">Bachelor of Information Technology</option>
        <option value="/business">Bachelor of Business</option>
        <option value="/design">Bachelor of Design</option>
        <option value="/culinary">Bachelor of Culinary Arts</option>
      </select>
    </div>
  );
};

export default ProgramNav;
