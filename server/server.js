// const express = require('express');
// const fs = require('fs');
// const cors = require('cors');
// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// const dataFilePath = './data.json';
// const projectsFilePath = './projects.json';

// // GET all interns
// app.get('/api/interns', (req, res) => {
//   const data = JSON.parse(fs.readFileSync(dataFilePath));
//   res.json(data);
// });

// // POST new intern
// app.post('/api/interns', (req, res) => {
//   const newIntern = req.body;
//   const data = JSON.parse(fs.readFileSync(dataFilePath));
//   data.push(newIntern);
//   fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//   res.status(201).json({ message: 'Intern added' });
// });

// app.put('/api/interns/:id', (req, res) => {
//   const internId = req.params.id;
//   const updatedData = req.body;

//   const data = JSON.parse(fs.readFileSync(dataFilePath));
//   const internIndex = data.findIndex(intern => intern.id === internId || intern._id === internId);

//   if (internIndex === -1) {
//     return res.status(404).json({ message: 'Intern not found' });
//   }

//   // Update intern
//   data[internIndex] = { ...data[internIndex], ...updatedData };

//   fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
//   res.json({ message: 'Intern updated successfully', intern: data[internIndex] });
// });

// app.get('/api/projects', (req, res) => {
//   const projects = JSON.parse(fs.readFileSync(projectsFilePath));
//   res.json(projects);
// });

// // Assign intern to project
// app.post('/api/projects/assign', (req, res) => {
//   try {
//     const { projectId, internId } = req.body;
//     // console.log('Assign Request:', { projectId, internId });

//     const projects = JSON.parse(fs.readFileSync(projectsFilePath));
//     const interns = JSON.parse(fs.readFileSync(dataFilePath));

//     const project = projects.find(p => String(p.id) === String(projectId));
//     const intern = interns.find(i => String(i.id) === String(internId));

//     // console.log('Found Project:', project);
//     // console.log('Found Intern:', intern);

//     if (!project || !intern) {
//       return res.status(404).json({ message: 'Project or Intern not found' });
//     }

//     project.assignedInterns = project.assignedInterns || [];
//     if (!project.assignedInterns.some(i => i.id === internId)) {
//       project.assignedInterns.push({ id: internId, name: intern.name });
//     }

//     intern.assignedProject = projectId;

//     fs.writeFileSync(projectsFilePath, JSON.stringify(projects, null, 2));
//     fs.writeFileSync(dataFilePath, JSON.stringify(interns, null, 2));

//     res.json({ message: 'Intern assigned to project successfully' });
//   } catch (error) {
//     console.error('🔥 Error in assign route:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });


// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


// const express = require('express');
// const cors = require('cors');
// const internRoutes = require('./routes/internRoutes');
// const projectRoutes = require('./routes/projectRoutes'); // if you have one

// const app = express();
// const PORT = 5000;

// app.use(cors());
// app.use(express.json());

// app.use('/api/interns', internRoutes);
// app.use('/api/projects', projectRoutes); // if exists

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const internRoutes = require('./routes/internRoutes');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
connectDB();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/interns', internRoutes); // All intern-related routes
app.use('/api/projects', projectRoutes); // All project-related routes

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

