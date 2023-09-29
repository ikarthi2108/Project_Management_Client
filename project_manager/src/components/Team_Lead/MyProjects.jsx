import axios from 'axios';
import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';

const MyProject = () => {
  const user = sessionStorage.getItem('accessToken');
  const decoded = jwtDecode(user);
  const userEmail = decoded.email;

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/get-assignedtasks-tl?userEmail=${userEmail}`)
      .then((res) => {
        setProjects(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userEmail]);

  return (
    <div>
      <h4>Your Projects</h4>
      <div className="row">
        {projects.map((project, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Project Title: {project.projectTitle}</h5>
                <p className="card-text">Project Manager Email: {project.projectManagerEmail}</p>
                <p className="card-text">Team Lead: {project.teamLead}</p>
                <p className="card-text">Status: {project.status}</p>
                <p className="card-text">Client Name: {project.clientName}</p>
                <p className="card-text">Client Email: {project.clientEmail}</p>
                <p className="card-text">Client Skype ID: {project.clientSkypeId}</p>
                <p className="card-text">Project Description: {project.projectDescription}</p>
                <p className="card-text">Project Domain: {project.projectDomain}</p>
                <p className="card-text">Project Category: {project.projectCategory}</p>
                <p className="card-text">Start Date: {project.startDate}</p>
                <p className="card-text">End Date: {project.endDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProject;