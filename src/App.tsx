import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Home } from "@/pages/Home";
import { Sorting } from "@/pages/Sorting";
import { Graph } from "@/pages/Graph";
import { DynamicProgramming } from "@/pages/DynamicProgramming";
import { Compare } from "@/pages/Compare";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sorting" element={<Sorting />} />
          <Route path="/graph" element={<Graph />} />
          <Route path="/dp" element={<DynamicProgramming />} />
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </div>
    </Router>
  );
}
