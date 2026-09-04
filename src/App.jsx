import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";

import Navbar from "./components/Navbar";
import Projects from "./pages/Projects";
import Goals from "./pages/Goals";
import Tasks from "./pages/Tasks";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
