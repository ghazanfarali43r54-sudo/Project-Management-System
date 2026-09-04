import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Goals() {
  const [projects, setProjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectId: "",
      goalTitle: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    },
  });

  const selectedProject = watch("projectId");

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  useEffect(() => {
    const savedGoals = localStorage.getItem("goals");

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals, isLoaded]);

  const filteredGoals = goals.filter(
    (goal) => goal.projectId === selectedProject
  );

  const searchedGoals = filteredGoals.filter((goal) =>
    goal.goalTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    if (editingId) {
      const updatedGoals = goals.map((goal) =>
        goal.id === editingId ? { ...goal, ...data } : goal
      );

      setGoals(updatedGoals);
      setEditingId(null);
      setShowForm(false);
    } else {
      const newGoal = {
        id: crypto.randomUUID(),
        ...data,
      };

      setGoals([...goals, newGoal]);
    }

    reset({
      projectId: data.projectId,
      goalTitle: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    });
  };

  const editGoal = (goal) => {
    setEditingId(goal.id);
    setShowForm(true);
    reset({
      projectId: goal.projectId,
      goalTitle: goal.goalTitle,
      description: goal.description,
      priority: goal.priority,
      status: goal.status,
      startDate: goal.startDate,
      endDate: goal.endDate,
    });
  };

  const deleteGoal = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal? This will also delete all its tasks."
    );

    if (!confirmDelete) return;

    setGoals(goals.filter((goal) => goal.id !== id));

    const savedTasks = localStorage.getItem("tasks");
    const allTasks = savedTasks ? JSON.parse(savedTasks) : [];
    const remainingTasks = allTasks.filter((task) => task.goalId !== id);
    localStorage.setItem("tasks", JSON.stringify(remainingTasks));
  };

  return (
    <div className="page">
      <div className="goles">
        <h1 className="title">Goals</h1>
        <label>
          <h3>Select Project</h3>
        </label>
      </div>

      <select
        className="select"
        {...register("projectId", { required: "Please select a project" })}
      >
        <option value="">Select a project</option>

        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.projectName}
          </option>
        ))}
      </select>
      {errors.projectId && (
        <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
          {errors.projectId.message}
        </p>
      )}

      <div>
        <button
          type="button"
          className="toggle-form-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Close Form" : "+ Add Goal"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Goal Title</label>
            <input
              type="text"
              placeholder="Enter goal title"
              {...register("goalTitle", {
                required: "Goal title is required",
                pattern: {
                  value: /^[A-Za-z\s.,-]+$/,
                  message: "Only letters, spaces, and . , - are allowed",
                },
              })}
            />
            {errors.goalTitle && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.goalTitle.message}
              </p>
            )}
          </div>

          <div>
            <label>Description</label>
            <textarea
              placeholder="Enter goals description"
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
            {editingId ? "Update Goal" : "Add Goal"}
          </button>
        </form>
      )}

      <h2>Goal List</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search goals by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!selectedProject ? (
        <p>Please select a project to view its goals.</p>
      ) : searchedGoals.length === 0 ? (
        <p>{searchTerm ? "No matching goals." : "No goals yet for this project."}</p>
      ) : (
        <div className="list-container">
          {searchedGoals.map((goal) => (
            <div key={goal.id}>
              <h3>{goal.goalTitle}</h3>

              <p>{goal.description}</p>

              <p>Priority: {goal.priority}</p>

              <p>Status: {goal.status}</p>

              <p>Start Date: {goal.startDate}</p>

              <p>End Date: {goal.endDate}</p>

              <button onClick={() => editGoal(goal)}>Edit</button>

              <button onClick={() => deleteGoal(goal.id)}>Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Goals;