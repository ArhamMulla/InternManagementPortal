import { useState } from 'react';
import './AddProjectModal.css';

function AddProjectModal({ onClose, onAdd }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredTech, setRequiredTech] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProject = {
      id: Date.now().toString(), // simple unique ID
      name,
      description,
      requiredTech: requiredTech.split(',').map(tech => tech.trim()),
      assignedInterns: [],
    };
    onAdd(newProject);
    onClose();
  };

  return (
    <div className="add-project-modal">
      <div className="modal-content">
        <h3>Add New Project</h3>
        <form onSubmit={handleSubmit}>
          <label>Project Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />

          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />

          <label>Required Tech (comma separated)</label>
          <input value={requiredTech} onChange={e => setRequiredTech(e.target.value)} required />

          <div className="actions">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;
