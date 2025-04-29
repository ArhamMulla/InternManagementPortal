import { useState, useEffect } from 'react';
import { assignInternToProject, fetchProjects, fetchInterns, deleteProject } from '../services/api';
import './ProjectPage.css';
import AddProjectModal from '../components/AddProjectModal';
import { addProject } from '../services/api';

function ProjectPage() {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [projectsRes, internsRes] = await Promise.all([fetchProjects(), fetchInterns()]);
      setProjects(projectsRes);
      setInterns(internsRes.data);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignIntern = async () => {
    if (!selectedProject || !selectedIntern) {
      alert("Please select both a project and an intern.");
      return;
    }
  
    try {
      const response = await assignInternToProject(selectedProject, selectedIntern);
  
      console.log('Assign response:', response.data); // Add this to see response
  
      await fetchAllData(); // Refresh the data **after** assignment succeeds
      setSelectedProject('');
      setSelectedIntern('');
      alert("Intern assigned successfully!"); // Optional success message
    } catch (error) {
      console.error("Error assigning intern:", error);
      alert(error?.response?.data?.message || "There was an error assigning the intern.");
    }
  };
  

  const handleDeleteProject = async (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        // Call the API to delete the project
        await deleteProject(projectId);
        // Refresh the list of projects after deletion
        fetchAllData();
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('There was an error deleting the project.');
      }
    }
  };

  const handleAutoAssignInterns = async (project) => {
    const { id: projectId, requiredTech } = project;
  
    // Calculate match percentage for each intern
    const internMatches = interns.map(intern => {
      const internSkills = [...(intern.skills || []), ...(intern.techStack || [])];
      const matchCount = requiredTech.filter(tech => internSkills.includes(tech)).length;
      const matchPercent = (matchCount / requiredTech.length) * 100;
      return { ...intern, matchPercent };
    });
  
    // Sort interns by highest match
    internMatches.sort((a, b) => b.matchPercent - a.matchPercent);
  
    // Pick top 2
    const topInterns = internMatches.slice(0, 2).filter(i => i.matchPercent > 0);
  
    if (topInterns.length === 0) {
      alert('No suitable interns found for this project.');
      return;
    }
  
    try {
      // Assign each top intern
      for (const intern of topInterns) {
        await assignInternToProject(project.id, intern.id);
      }
  
      fetchAllData();  // Refresh projects
      alert(`Assigned: ${topInterns.map(i => `${i.name} (${i.matchPercent.toFixed(0)}%)`).join(', ')}`);
    } catch (error) {
      console.error('Error auto-assigning interns:', error);
      alert('Failed to auto assign interns.');
    }
  };
  

  return (
    <div className="project-page">
      <div className="header">
        <h2>Available Projects</h2>
        <button className="add-project-btn" onClick={() => setShowAddModal(true)}>Add Project</button>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : projects.length === 0 ? (
        <p>No projects available.</p>
      ) : (
        <div className="project-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <p><strong>Required Tech:</strong> {project.requiredTech.join(', ')}</p>
              <button onClick={() => setSelectedProject(project.id)}>Assign Intern</button>
              <button className="delete-btn" onClick={() => handleDeleteProject(project.id)}>Delete</button>
              <button className="auto-assign-btn" onClick={() => handleAutoAssignInterns(project)}>
  Auto Assign
</button>
              <p>
                <strong>Assigned Interns:</strong>{" "}
                {project.assignedInterns?.length
                  ? project.assignedInterns.map(i => (typeof i === 'string' ? i : i.name)).join(', ')
                  : 'No Interns Assigned'}
              </p>
            </div>
          ))}
        </div>
      )}

{showAddModal && (
  <AddProjectModal
    onClose={() => setShowAddModal(false)}
    onAdd={async (newProject) => {
      await addProject(newProject);
      fetchAllData();
    }}
  />
)}

      {selectedProject && (
        <div className="modal">
          <div className="modal-header">
            <h4>Select Intern to Assign</h4>
            <button className="close-btn" onClick={() => {
              setSelectedProject('');
              setSelectedIntern('');
            }}>×</button>
          </div>
          <select onChange={(e) => setSelectedIntern(e.target.value)} value={selectedIntern}>
            <option value="">--Select Intern--</option>
            {interns.map(intern => (
              <option key={intern.id} value={intern.id}>
                {intern.name} — Skills: {intern.skills?.join(', ')} — Interests: {intern.techStack?.join(', ')}
              </option>
            ))}
          </select>
          <button className='assign-btn' onClick={handleAssignIntern}>Assign Intern</button>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
