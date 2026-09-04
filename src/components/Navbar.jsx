import { Link } from "react-router-dom";   //Router links use to import compunents

function Navbar() {
  return (
    <nav className="navbar">
      
      <Link to="/dashboard">Dashboard</Link>  
      <Link to="/projects">Projects</Link>
      <Link to="/goals">Goals</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/dashboard">FakeDash</Link>  
      <Link to="/projects">FaleProj</Link>
      <Link to="/goals">FakeGoals</Link>
      <Link to="/tasks">FakeTasks</Link>
      <Link to="/dashboard">FakeDash</Link>  
      <Link to="/projects">FakeProj</Link>
      <Link to="/goals">FakeGoals</Link>
      <Link to="/tasks">Fakeasks</Link>
    </nav>
  );
}

export default Navbar;