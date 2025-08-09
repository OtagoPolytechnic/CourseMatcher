import { useNavigate } from 'react-router-dom';

const ProgramNav = () => {
  const navigate = useNavigate();

  const programs = [
    { name: 'Bachelor of Information Technology', path: '/' },
    { name: 'Bachelor of Business', path: '/business' },
    { name: 'Bachelor of Design', path: '/design' },
    { name: 'Bachelor of Culinary Arts', path: '/culinary' },
  ];

  return (
    <div className="absolute top-4 right-4 z-50 group inline-block">
      <div className="bg-gray-800 w-10 h-10 rounded flex flex-col justify-center items-center cursor-pointer">
        <div className="w-6 h-0.5 bg-white mb-1" />
        <div className="w-6 h-0.5 bg-white mb-1" />
        <div className="w-6 h-0.5 bg-white" />
      </div>

      <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg py-2 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition duration-150 ease-in-out">
        {programs.map((program) => (
          <button
            key={program.path}
            onClick={() => navigate(program.path)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-100"
          >
            {program.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProgramNav;
