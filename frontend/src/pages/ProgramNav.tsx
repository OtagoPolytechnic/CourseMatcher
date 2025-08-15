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
    <div className="fixed top-4 right-4 z-50 group">
      <div className="bg-blue-700 hover:bg-blue-800 transition-colors w-12 h-12 rounded-lg flex flex-col justify-center items-center cursor-pointer shadow-lg">
        <div className="w-6 h-0.5 bg-white mb-1" />
        <div className="w-6 h-0.5 bg-white mb-1" />
        <div className="w-6 h-0.5 bg-white" />
      </div>
      
      <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
        <h3 className="text-md font-semibold px-4 py-3 text-blue-700 border-b">Select a Program</h3>
        <ul>
          {programs.map((program) => (
            <li key={program.path}>
              <button
                onClick={() => navigate(program.path)}
                className="block w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-150"
              >
                {program.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProgramNav;