import { useState } from "react";
import './ProfileCard.css';

function ProfileCard({ 
  name, 
  description, 
  skills = [], 
  funFact, 
  email, 
  phone,
  image, 
  role, 
  joiningDate,
  techStack=[],
  assignedProject=[],
}) {
  const [showFunFact, setShowFunFact] = useState(false);

  // const profileSrc = image && image.trim() !== "" ? image : studentImage;

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
      <p><strong>Tech Stack:</strong> {techStack?.join(', ') || 'N/A'}</p>
      <p><strong>Assigned Project:</strong> {assignedProject || 'None'}</p>

      <div className="profile-toggle">
        <span>Show Fun Fact</span>
        <div
          className={`toggle-switch ${showFunFact ? "active" : ""}`}
          onClick={() => setShowFunFact(!showFunFact)}
        >
          <div className="switch-circle" />
        </div>
      </div>

      {showFunFact && (
        <div className="fun-fact">
          💡 {funFact}
        </div>
      )}
    </div>
  </div>
</div>

  );
}

export default ProfileCard;
