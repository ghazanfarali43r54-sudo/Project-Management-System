import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

function Tasks() {
  const [projects, setProjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectId: "",
      goalId: "",
      taskName: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    },
  });

  const selectedProject = watch("projectId");
  const selectedGoal = watch("goalId");

  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedGoals = localStorage.getItem("goals");

    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const filteredGoals = goals.filter(
    (goal) => goal.projectId === selectedProject
  );

  const filteredTasks = tasks.filter((task) => {
    if (selectedProject && task.projectId !== selectedProject) return false;
    if (selectedGoal && task.goalId !== selectedGoal) return false;
    return true;
  });

  const searchedTasks = filteredTasks.filter((task) =>
    task.taskName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data) => {
    if (editingId) {
      const updatedTasks = tasks.map((task) =>
        task.id === editingId ? { ...task, ...data } : task
      );

      setTasks(updatedTasks);
      setEditingId(null);
      setShowForm(false);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        ...data,
      };

      setTasks([...tasks, newTask]);
    }

    reset({
      projectId: data.projectId,
      goalId: data.goalId,
      taskName: "",
      description: "",
      priority: "Medium",
      status: "Not Started",
      startDate: "",
      endDate: "",
    });
  };

  const editTask = (task) => {
    setEditingId(task.id);
    setShowForm(true);
    reset({
      projectId: task.projectId,
      goalId: task.goalId,
      taskName: task.taskName,
      description: task.description,
      priority: task.priority,
      status: task.status,
      startDate: task.startDate,
      endDate: task.endDate,
    });
  };

  const deleteTask = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (confirmDelete) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  return (
    <div className="page">
      <h1 className="title">Tasks</h1>

      <button
        type="button"
        className="toggle-form-btn"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Close Form" : "+ Add Task"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="task">
            <div>
              <label>
                <h3>Select Project</h3>
              </label>
            </div>

            <select
              className="select-task"
              {...register("projectId", { required: "Please select a project" })}
              onChange={(e) => {
                setValue("projectId", e.target.value);
                setValue("goalId", "");
              }}
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
          </div>

          <div>
            <label>Select Goal</label>

            <select
              {...register("goalId", { required: "Please select a goal" })}
              disabled={!selectedProject}
            >
              <option value="">Select a goal</option>

              {filteredGoals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.goalTitle}
                </option>
              ))}
            </select>
            {errors.goalId && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.goalId.message}
              </p>
            )}
          </div>

          <div>
            <label>Task Name</label>

            <input
              type="text"
              placeholder="Enter task name"
              {...register("taskName", {
                required: "Task name is required",
                pattern: {
                  value: /^[A-Za-z\s.,-]+$/,
                  message: "Only letters, spaces, and . , - are allowed",
                },
              })}
            />
            {errors.taskName && (
              <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
                {errors.taskName.message}
              </p>
            )}
          </div>

          <div>
            <label>Description</label>
            <textarea
              placeholder="Enter task description"
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
            {editingId ? "Update Task" : "Add Task"}
          </button>
        </form>
      )}

      <h2>Task List</h2>

      <input
        type="text"
        className="search-bar"
        placeholder="Search tasks by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchedTasks.length === 0 ? (
        <p>
          {searchTerm
            ? "No matching tasks."
            : selectedProject || selectedGoal
            ? "No tasks match the selected project/goal."
            : "No tasks yet."}
        </p>
      ) : (
        <div className="list-container">
          {searchedTasks.map((task) => {
            const taskProject = projects.find((p) => p.id === task.projectId);
            const taskGoal = goals.find((g) => g.id === task.goalId);

            return (
              <div key={task.id}>
                <h3>{task.taskName}</h3>

                <h3 className="task-meta">
                  Project: {taskProject ? taskProject.projectName : "Unknown"}
                  {" · "}
                  <br />
                  Goal: {taskGoal ? taskGoal.goalTitle : "Unknown"}
                </h3>

                <p>{task.description}</p>

                <p>Priority: {task.priority}</p>

                <p>Status: {task.status}</p>

                <p>Start Date: {task.startDate}</p>

                <p>End Date: {task.endDate}</p>

                <button onClick={() => editTask(task)}>Edit</button>

                <button onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Tasks;