import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UnitHead.css";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignProject = () => {
  const token = sessionStorage.getItem("user");
  const decodedToken = jwtDecode(token);

  const AssignedHeadEmail = decodedToken.email;

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectManager, setProjectManager] = useState("");
  const [projectManagers, setProjectManagers] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientSkypeId, setClientSkypeId] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:3001/getEmp-data")
      .then((res) => {
        const managers = res.data.filter(
          (employee) => employee.Designation === "ProjectManager"
        );
        setProjectManagers(managers);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!projectTitle.match(/^[A-Za-z\s]+$/) || projectTitle.length > 35) {
      errors.projectTitle =
        "Project Title should be alphabets only, maximum 35 characters.";
    }
    if (!projectDescription) {
      errors.projectDescription = "Project Description is required.";
    }
    if (!projectManager) {
      errors.projectManager = "Project Manager is required.";
    }
    if (!clientName) {
      errors.clientName = "Client Name is required.";
    }
    if (
      !clientEmail.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)
    ) {
      errors.clientEmail = "Invalid Client Email format.";
    }
    if (!clientSkypeId) {
      errors.clientSkypeId = "Client Skype ID is required.";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0; // Return true if no errors
  };

  const handleAssignProject = () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    const selectedManager = projectManagers.find(
      (manager) => manager.EmployeeName === projectManager
    );
    const managerEmail = selectedManager ? selectedManager.Email : "";

    const data = {
      projectTitle,
      projectDescription,
      projectManager: projectManager,
      managerEmail: managerEmail,
      UnitHeadEmail: AssignedHeadEmail,
      clientName,
      clientEmail,
      clientSkypeId,
    };

    setIsLoading(true);

    axios
      .post("http://localhost:3001/assignProject", data)
      .then((res) => {
        setIsLoading(false);
        toast.success("Project Assigned Successfully!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setProjectTitle("");
        setProjectDescription("");
        setProjectManager("");
        setClientName("");
        setClientEmail("");
        setClientSkypeId("");
        setErrors({});
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        toast.error("An error occurred while assigning the project.", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <div className="row assign-project container table-report">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <h2 className="mb-3 mt-2 ms-3 ">Assign Project</h2>
      <p className="alert alert-primary ms-3">
        Note: The Project Details Will be Sent As Email Also!
      </p>
      <div className="row border table-report ms-3">
        <div className="col-md-6 ">
          <div className="form  p-3">
            <div className="mb-3">
              <label htmlFor="project-title" className="form-label">
                <strong> Project Title</strong>
              </label>
              <input
                type="text"
                id="project-title"
                className="form-control"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                disabled={loading}
              />
              {errors.projectTitle && (
                <div className="text-danger">{errors.projectTitle}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="project-description" className="form-label">
                <strong> Project Description</strong>
              </label>
              <textarea
                id="project-description"
                className="form-control"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                rows="4"
                disabled={loading}
              />
              {errors.projectDescription && (
                <div className="text-danger">{errors.projectDescription}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="project-manager" className="form-label">
                <strong> Project Manager</strong>
              </label>
              <select
                className="form-select"
                id="project-manager"
                value={projectManager}
                onChange={(e) => setProjectManager(e.target.value)}
                disabled={loading}
              >
                <option value=""><strong>Select Manager</strong></option>
                {projectManagers.map((manager) => (
                  <option key={manager._id} value={manager.EmployeeName}>
                    {manager.EmployeeName}
                  </option>
                ))}
              </select>
              {errors.projectManager && (
                <div className="text-danger">{errors.projectManager}</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 ">
          <div className="form  p-3 ">
            <div className="mb-3">
              <label htmlFor="client-name" className="form-label">
                <strong>Client Name</strong>
              </label>
              <input
                type="text"
                id="client-name"
                className="form-control"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                disabled={loading}
              />
              {errors.clientName && (
                <div className="text-danger">{errors.clientName}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="client-email" className="form-label">
                <strong> Client Email</strong>
              </label>
              <input
                type="email"
                id="client-email"
                className="form-control"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                disabled={loading}
              />
              {errors.clientEmail && (
                <div className="text-danger">{errors.clientEmail}</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="client-skype-id" className="form-label">
                <strong> Client Skype ID</strong>
              </label>
              <input
                type="text"
                id="client-skype-id"
                className="form-control"
                value={clientSkypeId}
                onChange={(e) => setClientSkypeId(e.target.value)}
                disabled={loading}
              />
              {errors.clientSkypeId && (
                <div className="text-danger">{errors.clientSkypeId}</div>
              )}
            </div>
            <button
              className="btn add-employeebtn text-white"
              onClick={handleAssignProject}
              disabled={loading}
            >
              
               {loading ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Assigning...
              </>
            ) : (
              "Assign Project"
            )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignProject;
