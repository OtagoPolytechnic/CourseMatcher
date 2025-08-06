import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgramNav from './pages/ProgramNav';
import BachelorIT from './pages/BachelorIT';
import './style.css';

function App() {
  return (
    <Router>
      <ProgramNav />
      <Routes>
        <Route path="/" element={<BachelorIT />} />
      </Routes>
    </Router>
  );
}

export default App;
