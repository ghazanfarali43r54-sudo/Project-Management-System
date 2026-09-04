import { useState } from "react";

function SharedFields({
  description,
  setDescription,
  descriptionPlaceholder,
  priority,
  setPriority,
  status,
  setStatus,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  const [descriptionError, setDescriptionError] = useState("");

  const isValidText = (value) => /^[A-Za-z\s.,-]*$/.test(value);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    if (isValidText(value)) {
      setDescription(value);
      setDescriptionError("");
    } else {
      setDescriptionError("Only letters, spaces, and . , - are allowed");
    }
  };

  return (
    <>
      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder={descriptionPlaceholder}
        />
        {descriptionError && (
          <p style={{ color: "red", fontSize: "0.8rem", marginTop: "4px", fontStyle: "italic" }}>
            {descriptionError}
          </p>
        )}
      </div>

      <div>
        <label>Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label>Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div>
        <label>End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </>
  );
}

export default SharedFields;