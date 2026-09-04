import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects, isLoaded]);

  const searchedProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    if (editingId) {
      const updatedProjects = projects.map((project) =>
        project.id === editingId ? { ...project, ...data } : project
      );

      setProjects(updatedProjects);
      setEditingId(null);
      setShowForm(false);
    } else {
      const newProject = {
        id: crypto.randomUUID(),
        ...data,
      };

      setProjects([...projects, newProject]);
    }

    reset({
      projectName: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    });
  };

  const deleteProject = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This will also delete all its goals and tasks."
    );

    if (!confirmDelete) return;

    setProjects(projects.filter((project) => project.id !== id));

    const savedGoals = localStorage.getItem("goals");
    const allGoals = savedGoals ? JSON.parse(savedGoals) : [];

    const goalIdsToDelete = allGoals
      .filter((goal) => goal.projectId === id)
      .map((goal) => goal.id);

    const remainingGoals = allGoals.filter((goal) => goal.projectId !== id);
    localStorage.setItem("goals", JSON.stringify(remainingGoals));

    const savedTasks = localStorage.getItem("tasks");
    const allTasks = savedTasks ? JSON.parse(savedTasks) : [];

    const remainingTasks = allTasks.filter(
      (task) =>
        task.projectId !== id && !goalIdsToDelete.includes(task.goalId)
    );
    localStorage.setItem("tasks", JSON.stringify(remainingTasks));
  };

  const editProject = (project) => {
    setEditingId(project.id);
    setShowForm(true);
    reset({
      projectName: project.projectName,
      description: project.description,
      priority: project.priority,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
    });
  };

  return (
    <div className="page">
      <h1 className="title">projects</h1>

      <button
        type="button"
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "+ Add Project"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              {...register("projectName", {
                required: "Project name is required",
                pattern: {
                  value: /^[A-Za-z\s.,-]+$/,
                  message: "Only letters, spaces, and . , - are allowed",
                },
              })}
            />
            {errors.projectName && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div>
            <label>Description</label>
            <textarea
              placeholder="Enter project description"
              {...register("description", {
                required: "Description is required",
                pattern: {
                  value: /^[A-Za-z\s.,-]+$/,
                  message: "Only letters, spaces, and . , - are allowed",
                },
              })}
            />
            {errors.description && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label>Priority</label>
            <select {...register("priority")}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select {...register("status")}>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div>
            <label>Start Date</label>
            <input
              type="date"
              {...register("startDate", { required: "Start date is required" })}
            />
            {errors.startDate && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.startDate.message}
              </p>
            )}
          </div>

          <div>
            <label>End Date</label>
            <input
              type="date"
              {...register("endDate", {
                required: "End date is required",
                validate: (value) =>
                  !watch("startDate") ||
                  new Date(value) >= new Date(watch("startDate")) ||
                  "End date cannot be before start date",
              })}
            />
            {errors.endDate && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.endDate.message}
              </p>
            )}
          </div>

          <button type="submit">
            {editingId ? "Update Project" : "Add Project"}
          </button>
        </form>
      )}

      <h2>Project List</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search projects by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchedProjects.length === 0 ? (
        <p>{searchTerm ? "No matching projects." : "No projects yet."}</p>
      ) : (
        <div className="list-container">
          {searchedProjects.map((project) => (
            <div key={project.id}>
              <h3>{project.projectName}</h3>

              <p>{project.description}</p>

              <p>Priority: {project.priority}</p>

              <p>Status: {project.status}</p>

              <p>Start Date: {project.startDate}</p>

              <p>End Date: {project.endDate}</p>

              <button onClick={() => editProject(project)}>Edit</button>

              <button onClick={() => deleteProject(project.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Projects;