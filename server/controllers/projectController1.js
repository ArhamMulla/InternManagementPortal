const Project = require('../models/Project');
const Intern = require('../models/Intern');

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects', error });
  }
};

// Assign intern to project
exports.assignInternToProject = async (req, res) => {
  console.log("Reached assignInternToProject");
  try {
    const { projectId, internId } = req.body;

    console.log("Received Project ID:", projectId);
    console.log("Received Intern ID:", internId);

    const project = await Project.findOne({ id: projectId });
    const intern = await Intern.findOne({ id: internId });

    if (!project) {
      console.error("Project not found for id:", projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!intern) {
      console.error("Intern not found for id:", internId);
      return res.status(404).json({ message: 'Intern not found' });
    }

    console.log("Found Project:", project);
    console.log("Found Intern:", intern);

    project.assignedInterns = project.assignedInterns || [];

    const alreadyAssigned = project.assignedInterns.some(i => i.internId === internId);

    if (!alreadyAssigned) {
      project.assignedInterns.push({ internId: internId, name: intern.name });
      await project.save();
    }

    // ❗️ Important: Save real _id
    intern.assignedProject = project._id;
    await intern.save();

    res.status(200).json({ message: 'Intern assigned to project successfully' });
  } catch (error) {
    console.error("Error in assigning intern to project:", error);
    res.status(500).json({ message: 'Error assigning intern', error: error.message });
  }
};




// Add a new project
exports.addProject = async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.status(201).json({ message: 'Project added', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error adding project', error });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  const projectId = req.params.id;  // ID coming from the URL
  try {
    const deletedProject = await Project.findOneAndDelete({ id: projectId }); // match by 'id'

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
};
