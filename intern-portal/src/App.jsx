// import InternList from './components/InternList';
// import InternTable from './components/InternTable';

// function App() {
//   return (
//     <>
//       <InternList/>
//     </>
//   )
// }

// export default App

// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import InternList from "./components/InternList";
// import InternForm from "./components/InternForm";
// import InternTable from "./components/InternTable";
// import ProfilePage from "./components/ProfileCard"; // you'll create this

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<InternList />} />
//         <Route path="/add" element={<InternForm />} />
//         <Route path="/table" element={<InternTable />} />
//         <Route path="/intern/:id" element={<ProfilePage />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InternForm from "./components/InternForm";
import ProfileCard from "./components/ProfileCard";
import TechPreferences from "./components/TechPreferences";
import TechStats from "./components/TechStats";
import "./App.css";
import ProjectPage from "./components/ProjectPage";
import InternDirectory from "./components/InternDirectory";

function App() {
  return (
    <Router>
      <div className="navbar">
        <div className="nav-left">Intern Directory</div>
        <div className="nav-right">
          <Link to="/">Home</Link>
          <Link to="/add">Add</Link>
          <Link to="/preferences">Preferences</Link>
          <Link to="/stats">Stats</Link>
          <Link to="/projects">Projects</Link>
        </div>
      </div>

      <div className="main-content">
        <Routes>
          {/* <Route path="/" element={<InternList />} /> */}
          <Route path="/" element={<InternDirectory />} />
          <Route path="/add" element={<InternForm />} />
          <Route path="/intern/:id" element={<ProfileCard />} />
           <Route path="/preferences" element={<TechPreferences />} />
           <Route path="/projects" element={<ProjectPage />} />
          <Route path="/stats" element={<TechStats />} />
          <Route path="/projects" element={<ProjectPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
