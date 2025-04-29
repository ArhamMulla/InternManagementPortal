import { useEffect, useState, useMemo } from "react";
import { fetchInterns,deleteIntern } from "../services/api";
import ProfileCard from "./ProfileCard";
import "./InternDirectory.css";
import InternForm from "./InternForm";

function InternDirectory() {
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddInternForm, setShowAddInternForm] = useState(false);

  const internsPerPage = 3;

  useEffect(() => {
    fetchInterns()
      .then((res) => setInterns(res.data))
      .catch((err) => console.error("Failed to fetch interns:", err));
  }, []);

  const filteredInterns = useMemo(() => {
    let result = [...interns];

    if (searchTerm) {
      result = result.filter(i =>
        i.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRole !== "All") {
      result = result.filter(i => i.role === filterRole);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.joiningDate);
      const dateB = new Date(b.joiningDate);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [interns, searchTerm, filterRole, sortOrder]);

  const totalPages = Math.ceil(filteredInterns.length / internsPerPage);
  const paginatedInterns = filteredInterns.slice(
    (currentPage - 1) * internsPerPage,
    currentPage * internsPerPage
  );

  const uniqueRoles = useMemo(
    () => ["All", ...new Set(interns.map(intern => intern.role))],
    [interns]
  );

  const handleDeleteIntern = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this intern?");
    if (!confirmDelete) return;
  
    try {
      // Send the DELETE request to the backend
      await deleteIntern(id);
      
      // Update the local state to remove the deleted intern
      setInterns(prevInterns => prevInterns.filter(intern => intern.id !== id));
      
      // Optional: You can show an alert or toast here
      alert("Intern deleted successfully!");
  
    } catch (error) {
      console.error("Failed to delete intern:", error);
      alert("Failed to delete intern. Please try again.");
    }
  };

  // 📌 If an intern is selected, show their profile
  if (selectedIntern) {
    return (
      <div className="intern-directory-container">
        <button onClick={() => setSelectedIntern(null)} className="table-button">
          Back to Directory
        </button>
        <ProfileCard {...selectedIntern} />
      </div>
    );
  }

  return (
    <div className="intern-directory-container">

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={filterRole}
          onChange={e => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
        >
          {uniqueRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
        <button className="green-button" onClick={() => setSortOrder(prev => (prev === "asc" ? "desc" : "asc"))}>
          Sort by Joining Date ({sortOrder})
        </button>
        <button className="green-button" onClick={() => setShowAddInternForm(true)}>
          Add Intern      
          </button>
      </div>

      {showAddInternForm && (
        <div className="modal-overlay">
          <InternForm 
            onClose={() => setShowAddInternForm(false)} 
            onAddIntern={(newIntern) => setInterns(prev => [...prev, newIntern])} // ✨
          />
        </div>
      )}

      <div className="card-grid">
        {paginatedInterns.map((intern, index) => (
          <div key={index} className="card">
            <img src={intern.image} alt={intern.name} className="card-img" />
            <h2>{intern.name}</h2>
            <p><strong>Email:</strong> {intern.email}</p>
            <p><strong>Joining:</strong> {intern.joiningDate}</p>
            <div className="skills">
              <strong>Skills:</strong>
              <ul>
                {intern.skills?.map((skill, i) => <li key={i}>{skill}</li>)}
              </ul>
            </div>
            <button
              className="green-button"
              onClick={() => setSelectedIntern(intern)}
            >
              View Full Profile
            </button>
            <button
              className="red-button"
              onClick={() => handleDeleteIntern(intern.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        <button className="green-button" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button className="green-button" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
      </div>
    </div>
  );
}

export default InternDirectory;
