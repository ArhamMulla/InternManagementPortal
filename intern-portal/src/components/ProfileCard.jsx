import { useState } from "react";
import './ProfileCard.css';
import InternForm from "./InternForm";
import { updateIntern } from "../services/api"; // Import the update API

function ProfileCard({ 
  id,
  name, 
  description, 
  skills = [], 
  funFact, 
  email, 
  phone,
  image, 
  role, 
  joiningDate,
  techStack = [],
  assignedProject = [],
}) {
  const [showFunFact, setShowFunFact] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateIntern = async (updatedIntern) => {
    try {
      await updateIntern(id, updatedIntern); // use correct ID from props
      window.location.reload(); // optional: lift state instead
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="profile-card">
      <div className="profile-content">
        <img src={image} alt={name} className="profile-image" />

        <div className="profile-info">
          <h2>{name}</h2>
          <p>{description}</p>

          <div className="profile-skills">
            <p><strong>Skills:</strong></p>
            <ul>
              {skills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>Role:</strong> {role}</p>
          <p><strong>Joining Date:</strong> {joiningDate}</p>
          <p><strong>Tech Stack:</strong> {techStack.join(', ') || 'N/A'}</p>
          <p><strong>Assigned Project:</strong> {assignedProject?.name || 'None'}</p>


          <div className="profile-toggle">
            <span>Show Fun Fact</span>
            <div
              className={`toggle-switch ${showFunFact ? "active" : ""}`}
              onClick={() => setShowFunFact(!showFunFact)}
            >
              <div className="switch-circle" />
            </div>
          </div>

          <button onClick={() => setIsEditing(true)}>Edit</button>

          {isEditing && (
            <InternForm
              isEdit
              initialData={{
                id,
                name,
                description,
                skills,
                funFact,
                email,
                phone,
                image,
                gender: image?.includes("women") ? "female" : "male", // Guess gender if needed
                role,
                joiningDate,
              }}
              onUpdateIntern={handleUpdateIntern}
              onClose={() => setIsEditing(false)}
            />
          )}

          {showFunFact && (
            <div className="fun-fact">💡 {funFact}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;
