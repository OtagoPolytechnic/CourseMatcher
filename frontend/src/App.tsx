import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProgramNav from "./pages/ProgramNav";
import BachelorIT from "./pages/BachelorIT";
import BachelorBusiness from "./pages/BachelorBusiness";
import BachelorCulinary from "./pages/BachelorCulinary";
import BachelorDesign from "./pages/BachelorDesign";
import Home from "./pages/Home";
import "./style.css";

function App() {
  return (
      <Router>
        <ProgramNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/it" element={<BachelorIT />} />
          <Route path="/design" element={<BachelorDesign />} />
          <Route path="/business" element={<BachelorBusiness />} />
          <Route path="/culinary" element={<BachelorCulinary />} />
        </Routes>
      </Router>
  );
}

export default App;
