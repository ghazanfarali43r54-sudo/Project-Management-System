import { useEffect, useState } from "react";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState("overview");
  const [statusFilter, setStatusFilter] = useState(null);

  // Collapsible hierarchy state — which project/goal/task is expanded
  const [expandedProject, setExpandedProject] = useState(null);
  const [expandedGoal, setExpandedGoal] = useState(null);
  const [expandedTask, setExpandedTask] = useState(null);

  // Inline editing state — holds a copy of the item currently being edited
  const [editingProject, setEditingProject] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = () => {
    const savedProjects = localStorage.getItem("projects");
    const savedGoals = localStorage.getItem("goals");
    const savedTasks = localStorage.getItem("tasks");

    setProjects(savedProjects ? JSON.parse(savedProjects) : []);
    setGoals(savedGoals ? JSON.parse(savedGoals) : []);
    setTasks(savedTasks ? JSON.parse(savedTasks) : []);
  };

  // ---------- PROJECT: save / delete ----------
  const saveProject = () => {
    if (!editingProject.projectName.trim()) {
      alert("Project name is required");
      return;
    }

    const updatedProjects = projects.map((p) =>
      p.id === editingProject.id ? editingProject : p
    );

    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setEditingProject(null);
  };

  const deleteProjectCascade = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This will also delete all its goals and tasks."
    );

    if (!confirmDelete) return;

    const updatedProjects = projects.filter((p) => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));

    const goalIdsToDelete = goals
      .filter((g) => g.projectId === id)
      .map((g) => g.id);

    const updatedGoals = goals.filter((g) => g.projectId !== id);
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    const updatedTasks = tasks.filter(
      (t) => t.projectId !== id && !goalIdsToDelete.includes(t.goalId)
    );
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // ---------- GOAL: save / delete ----------
  const saveGoal = () => {
    if (!editingGoal.goalTitle.trim()) {
      alert("Goal title is required");
      return;
    }

    const updatedGoals = goals.map((g) =>
      g.id === editingGoal.id ? editingGoal : g
    );

    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));
    setEditingGoal(null);
  };

  const deleteGoalCascade = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this goal? This will also delete all its tasks."
    );

    if (!confirmDelete) return;

    const updatedGoals = goals.filter((g) => g.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem("goals", JSON.stringify(updatedGoals));

    const updatedTasks = tasks.filter((t) => t.goalId !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // ---------- TASK: save / delete ----------
  const saveTask = () => {
    if (!editingTask.taskName.trim()) {
      alert("Task name is required");
      return;
    }

    const updatedTasks = tasks.map((t) =>
      t.id === editingTask.id ? editingTask : t
    );

    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    setEditingTask(null);
  };

  const deleteTaskSimple = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
  };

  // Count tasks by status (for the circular chart)
  const statusCounts = {
    "Not Started": tasks.filter((t) => t.status === "Not Started").length,
    "In Progress": tasks.filter((t) => t.status === "In Progress").length,
    "Completed": tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <div className="page">
      <div className="dash title">
        <h1>Dashboard</h1>
      </div>

      {/* Clickable summary cards */}
      <div className="dashboard-stats">
        <div
          className={activeView === "overview" ? "stat-card active" : "stat-card"}
          onClick={() => setActiveView("overview")}
        >
          <p>Overview</p>
        </div>

        <div
          className={activeView === "projects" ? "stat-card active" : "stat-card"}
          onClick={() => setActiveView("projects")}
        >
          <p>Projects: {projects.length}</p>
        </div>

        <div
          className={activeView === "goals" ? "stat-card active" : "stat-card"}
          onClick={() => setActiveView("goals")}
        >
          <p>Goals: {goals.length}</p>
        </div>

        <div
          className={activeView === "tasks" ? "stat-card active" : "stat-card"}
          onClick={() => {
            setActiveView("tasks");
            setStatusFilter(null);
          }}
        >
          <p>Tasks: {tasks.length}</p>
        </div>
      </div>

      {/* ===== OVERVIEW VIEW ===== */}
      {activeView === "overview" && (
        <>
          <div className="status text-5xl text-green-500">
            <h2>Tasks by Status</h2>
          </div>
          <div className="circle-chart-grid">
            {Object.entries(statusCounts).map(([label, count]) => {
              const total = tasks.length || 1;
              const percent = Math.round((count / total) * 100);

              let circleColor;
              if (percent <= 33) {
                circleColor = "#93c5fd";
              } else if (percent <= 66) {
                circleColor = "#fde68a";
              } else {
                circleColor = "#fca5a5";
              }

              return (
                <div
                  className="circle-chart-item"
                  key={label}
                  onClick={() => {
                    setStatusFilter(label);
                    setActiveView("tasks");
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div
                    className="circle-chart"
                    style={{
                      background: `conic-gradient(${circleColor} ${percent * 3.6}deg, #e5e7eb 0deg)`,
                    }}
                  >
                    <div className="circle-chart-inner">
                      <span className="circle-chart-percent">{percent}%</span>
                    </div>
                  </div>
                  <p className="circle-chart-label">
                    {label} ({count})
                  </p>
                </div>
              );
            })}
          </div>

          <div className="title text-5xl text-red-300">
            <h2>All Overview</h2>
          </div>

          {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <div className="list-container">
              {projects.map((project) => {
                const projectGoals = goals.filter(
                  (goal) => goal.projectId === project.id
                );
                const isEditingThisProject = editingProject?.id === project.id;
                const isProjectExpanded = expandedProject === project.id;

                return (
                  <div key={project.id} className="project-block">
                    {isEditingThisProject ? (
                      <div className="inline-edit-form">
                        <input
                          type="text"
                          value={editingProject.projectName}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              projectName: e.target.value,
                            })
                          }
                        />
                        <textarea
                          value={editingProject.description}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              description: e.target.value,
                            })
                          }
                        />
                        <button onClick={saveProject}>Save</button>
                        <button onClick={() => setEditingProject(null)}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Project bar: clickable name + actions at right corner */}
                        <div className="block-header">
                          <button
                            type="button"
                            className="block-name"
                            onClick={() =>
                              setExpandedProject(
                                isProjectExpanded ? null : project.id
                              )
                            }
                          >
                            <span className="block-arrow">
                              {isProjectExpanded ? "▾" : "▸"}
                            </span>
                            {project.projectName}
                          </button>
                          <div className="block-actions">
                            <button onClick={() => setEditingProject(project)}>
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProjectCascade(project.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* Expanded project details + goals */}
                        {isProjectExpanded && (
                          <div className="block-details">
                            <p><strong>Description:</strong> {project.description}</p>
                            <p><strong>Priority:</strong> {project.priority}</p>
                            <p><strong>Status:</strong> {project.status}</p>
                            <p><strong>Start Date:</strong> {project.startDate}</p>
                            <p><strong>End Date:</strong> {project.endDate}</p>

                            <h4 className="block-subheading">
                              Goals ({projectGoals.length})
                            </h4>

                            {projectGoals.length === 0 ? (
                              <p>No goals for this project.</p>
                            ) : (
                              projectGoals.map((goal) => {
                                const goalTasks = tasks.filter(
                                  (task) => task.goalId === goal.id
                                );
                                const isEditingThisGoal =
                                  editingGoal?.id === goal.id;
                                const isGoalExpanded =
                                  expandedGoal === goal.id;

                                return (
                                  <div key={goal.id} className="goal-block">
                                    {isEditingThisGoal ? (
                                      <div className="inline-edit-form">
                                        <input
                                          type="text"
                                          value={editingGoal.goalTitle}
                                          onChange={(e) =>
                                            setEditingGoal({
                                              ...editingGoal,
                                              goalTitle: e.target.value,
                                            })
                                          }
                                        />
                                        <textarea
                                          value={editingGoal.description}
                                          onChange={(e) =>
                                            setEditingGoal({
                                              ...editingGoal,
                                              description: e.target.value,
                                            })
                                          }
                                        />
                                        <button onClick={saveGoal}>
                                          Save
                                        </button>
                                        <button
                                          onClick={() => setEditingGoal(null)}
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    ) : (
                                      <>
                                        {/* Goal bar */}
                                        <div className="block-header">
                                          <button
                                            type="button"
                                            className="block-name"
                                            onClick={() =>
                                              setExpandedGoal(
                                                isGoalExpanded ? null : goal.id
                                              )
                                            }
                                          >
                                            <span className="block-arrow">
                                              {isGoalExpanded ? "▾" : "▸"}
                                            </span>
                                            {goal.goalTitle}
                                          </button>
                                          <div className="block-actions">
                                            <button
                                              onClick={() =>
                                                setEditingGoal(goal)
                                              }
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={() =>
                                                deleteGoalCascade(goal.id)
                                              }
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>

                                        {/* Expanded goal details + tasks */}
                                        {isGoalExpanded && (
                                          <div className="block-details">
                                            <p><strong>Description:</strong> {goal.description}</p>
                                            <p><strong>Priority:</strong> {goal.priority}</p>
                                            <p><strong>Status:</strong> {goal.status}</p>
                                            <p><strong>Start Date:</strong> {goal.startDate}</p>
                                            <p><strong>End Date:</strong> {goal.endDate}</p>

                                            <h4 className="block-subheading">
                                              Tasks ({goalTasks.length})
                                            </h4>

                                            {goalTasks.length === 0 ? (
                                              <p>No tasks for this goal.</p>
                                            ) : (
                                              goalTasks.map((task) => {
                                                const isEditingThisTask =
                                                  editingTask?.id === task.id;
                                                const isTaskExpanded =
                                                  expandedTask === task.id;

                                                return (
                                                  <div
                                                    key={task.id}
                                                    className="task-row"
                                                  >
                                                    {isEditingThisTask ? (
                                                      <div className="inline-edit-form">
                                                        <input
                                                          type="text"
                                                          value={editingTask.taskName}
                                                          onChange={(e) =>
                                                            setEditingTask({
                                                              ...editingTask,
                                                              taskName: e.target.value,
                                                            })
                                                          }
                                                        />
                                                        <select
                                                          value={editingTask.status}
                                                          onChange={(e) =>
                                                            setEditingTask({
                                                              ...editingTask,
                                                              status: e.target.value,
                                                            })
                                                          }
                                                        >
                                                          <option value="Not Started">
                                                            Not Started
                                                          </option>
                                                          <option value="In Progress">
                                                            In Progress
                                                          </option>
                                                          <option value="Completed">
                                                            Completed
                                                          </option>
                                                        </select>
                                                        <button onClick={saveTask}>
                                                          Save
                                                        </button>
                                                        <button
                                                          onClick={() =>
                                                            setEditingTask(null)
                                                          }
                                                        >
                                                          Cancel
                                                        </button>
                                                      </div>
                                                    ) : (
                                                      <>
                                                        {/* Task bar */}
                                                        <div className="block-header">
                                                          <button
                                                            type="button"
                                                            className="block-name"
                                                            onClick={() =>
                                                              setExpandedTask(
                                                                isTaskExpanded
                                                                  ? null
                                                                  : task.id
                                                              )
                                                            }
                                                          >
                                                            <span className="block-arrow">
                                                              {isTaskExpanded
                                                                ? "▾"
                                                                : "▸"}
                                                            </span>
                                                            {task.taskName}
                                                            <span className="status-badge">
                                                              {task.status}
                                                            </span>
                                                          </button>
                                                          <div className="block-actions">
                                                            <button
                                                              onClick={() =>
                                                                setEditingTask(task)
                                                              }
                                                            >
                                                              Edit
                                                            </button>
                                                            <button
                                                              onClick={() =>
                                                                deleteTaskSimple(
                                                                  task.id
                                                                )
                                                              }
                                                            >
                                                              Delete
                                                            </button>
                                                          </div>
                                                        </div>

                                                        {/* Expanded task details */}
                                                        {isTaskExpanded && (
                                                          <div className="block-details">
                                                            <p><strong>Description:</strong> {task.description}</p>
                                                            <p><strong>Priority:</strong> {task.priority}</p>
                                                            <p><strong>Status:</strong> {task.status}</p>
                                                            <p><strong>Start Date:</strong> {task.startDate}</p>
                                                            <p><strong>End Date:</strong> {task.endDate}</p>
                                                          </div>
                                                        )}
                                                      </>
                                                    )}
                                                  </div>
                                                );
                                              })
                                            )}
                                          </div>
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ===== PROJECTS VIEW ===== */}
      {activeView === "projects" && (
        <>
          <h2>All Projects</h2>

          {projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            <div className="list-container">
              {projects.map((project) => (
                <div key={project.id}>
                  <h3>{project.projectName}</h3>
                  <p>{project.description}</p>
                  <p>Priority: {project.priority}</p>
                  <p>Status: {project.status}</p>
                  <p>Start Date: {project.startDate}</p>
                  <p>End Date: {project.endDate}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ===== GOALS VIEW ===== */}
      {activeView === "goals" && (
        <>
          <h2>All Goals</h2>

          {goals.length === 0 ? (
            <p>No goals yet.</p>
          ) : (
            <div className="list-container">
              {goals.map((goal) => {
                const goalProject = projects.find(
                  (p) => p.id === goal.projectId
                );

                return (
                  <div key={goal.id}>
                    <h3>{goal.goalTitle}</h3>
                    <p className="task-meta">
                      Project: {goalProject ? goalProject.projectName : "Unknown"}
                    </p>
                    <p>{goal.description}</p>
                    <p>Priority: {goal.priority}</p>
                    <p>Status: {goal.status}</p>
                    <p>Start Date: {goal.startDate}</p>
                    <p>End Date: {goal.endDate}</p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ===== TASKS VIEW ===== */}
      {activeView === "tasks" && (
        <>
          <h2>{statusFilter ? `Tasks — ${statusFilter}` : "All Tasks"}</h2>

          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              style={{
                marginBottom: "12px",
                padding: "6px 14px",
                borderRadius: "6px",
                border: "1px solid #d1d5db",
                cursor: "pointer",
                background: "white",
              }}
            >
              Clear filter (show all)
            </button>
          )}

          {(() => {
            const displayedTasks = statusFilter
              ? tasks.filter((t) => t.status === statusFilter)
              : tasks;

            if (displayedTasks.length === 0) {
              return <p>No tasks found.</p>;
            }

            return (
              <div className="list-container">
                {displayedTasks.map((task) => {
                  const taskProject = projects.find(
                    (p) => p.id === task.projectId
                  );
                  const taskGoal = goals.find((g) => g.id === task.goalId);

                  return (
                    <div key={task.id}>
                      <h3>{task.taskName}</h3>
                      <p className="task-meta">
                        Project: {taskProject ? taskProject.projectName : "Unknown"}
                        {" · "}
                        Goal: {taskGoal ? taskGoal.goalTitle : "Unknown"}
                      </p>
                      <p>{task.description}</p>
                      <p>Priority: {task.priority}</p>
                      <p>Status: {task.status}</p>
                      <p>Start Date: {task.startDate}</p>
                      <p>End Date: {task.endDate}</p>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

export default Dashboard;