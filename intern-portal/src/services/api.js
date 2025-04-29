import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchInterns = () => axios.get(`${API_URL}/interns`);
export const addIntern = (intern) => axios.post(`${API_URL}/interns`, intern);
export const updateIntern = (id, updatedData) => 
    axios.put(`${API_URL}/interns/${id}`, updatedData);

// export const fetchProjects = () => axios.get(`${API_URL}/projects`);
export const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`);
      console.log("this is your result"+res.data);  // Add this to check what is returned
      return res.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];  // Return an empty array if there's an error
    }
  };
export const assignInternToProject = (projectId, internId) =>
  axios.post(`${API_URL}/projects/assign`, { projectId, internId }).then(res => res.data);

export const addProject = (project) => axios.post(`${API_URL}/projects`, project);

export const deleteProject = (id) =>
  axios.delete(`${API_URL}/projects/${id}`);


export const deleteIntern = (id) => axios.delete(`${API_URL}/interns/${id}`);