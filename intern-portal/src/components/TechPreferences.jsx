import { useState, useEffect } from "react";
import { fetchInterns, updateIntern } from "../services/api";

import "./TechPreferences.css";

function TechPreferences() {
  const [interns, setInterns] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedTechs, setSelectedTechs] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const techOptions = ["React", "Node.js", "Python", "Django", "MongoDB", "Java"];

  useEffect(() => {
    fetchInterns().then(res => setInterns(res.data));
  }, []);

  const handleCheckbox = (tech) => {
    setSelectedTechs(prev =>
      prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
    );
  };

  const handleSubmit = async () => {
    const intern = interns.find(i => String(i.id) === selectedId);
    if (!intern) return;

    const updated = {
      ...intern,
      techStack: [...new Set([...(intern.techStack || []), ...selectedTechs])],
    };

    await updateIntern(selectedId, updated);
    setSubmitted(true);
  };

  if (submitted) {
    return <div className="thanks-msg">Thanks for submitting your preferences!</div>;
  }

  return (
    <div className="tech-preferences">
      <h2>Select Tech Stack for Intern</h2>

      <select onChange={e => setSelectedId(e.target.value)} value={selectedId}>
        <option value="">-- Select Intern --</option>
        {interns.map(intern => (
          <option key={intern.id} value={intern.id}>{intern.name}</option>
        ))}
      </select>

      <div className="checkbox-group">
        {techOptions.map(tech => (
          <label key={tech}>
            <input
              type="checkbox"
              checked={selectedTechs.includes(tech)}
              onChange={() => handleCheckbox(tech)}
            />
            {tech}
          </label>
        ))}
      </div>

      <button onClick={handleSubmit} disabled={!selectedId || selectedTechs.length === 0}>
        Submit
      </button>
    </div>
  );
}

export default TechPreferences;