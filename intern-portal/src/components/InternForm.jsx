import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { addIntern } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./InternForm.css";

function InternForm({ onClose, onAddIntern }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    gender: "male", // default
    description: "",
    skills: "",
    funFact: "",
    email: "",
    phone: "",
    role: "",
    joiningDate: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.description.trim()) errs.description = "Description is required";
    if (!formData.skills.trim()) errs.skills = "At least one skill is required";
    if (!formData.funFact.trim()) errs.funFact = "Fun fact is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (!formData.phone.trim()) errs.phone = "Phone is required";
    if (!formData.role.trim()) errs.role = "Role is required";
    if (!formData.joiningDate.trim()) errs.joiningDate = "Joining Date is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const randomId = Math.floor(Math.random() * 99); // 0 to 99
    const genderPath = formData.gender === "female" ? "women" : "men";

    const newIntern = {
      id: uuidv4(),
      ...formData,
      skills: formData.skills.split(",").map((skill) => skill.trim()),
      image: formData.image || `https://randomuser.me/api/portraits/${genderPath}/${randomId}.jpg`,
    };

    try {
      await addIntern(newIntern);
      // navigate("/");
      onAddIntern(newIntern); // 👈 tell parent that new intern is added
      onClose();
    } catch (err) {
      console.error("Failed to add intern:", err);
    }
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <h2>Add New Intern</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} />
          {errors.name && <span className="error">{errors.name}</span>}

          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
          {errors.description && <span className="error">{errors.description}</span>}

          <label>Skills (comma separated):</label>
          <input name="skills" value={formData.skills} onChange={handleChange} />
          {errors.skills && <span className="error">{errors.skills}</span>}

          <label>Fun Fact:</label>
          <input name="funFact" value={formData.funFact} onChange={handleChange} />
          {errors.funFact && <span className="error">{errors.funFact}</span>}

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          {errors.email && <span className="error">{errors.email}</span>}

          <label>Phone:</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
          {errors.phone && <span className="error">{errors.phone}</span>}

          <label>Role:</label>
          <input name="role" value={formData.role} onChange={handleChange} />
          {errors.role && <span className="error">{errors.role}</span>}

          <label>Joining Date:</label>
          <input type="date" name="joiningDate" value={formData.joiningDate} onChange={handleChange} />
          {errors.joiningDate && <span className="error">{errors.joiningDate}</span>}

          <label>Image URL (optional):</label>
          <input name="image" value={formData.image} onChange={handleChange} />

          <div className="form-buttons">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InternForm;