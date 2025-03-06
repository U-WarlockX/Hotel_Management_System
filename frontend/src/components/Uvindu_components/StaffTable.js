import React from "react";

const StaffTable = ({ staff, onUpdate, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Department</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {staff.map((member) => (
          <tr key={member._id}>
            <td>{`${member.firstName} ${member.lastName}`}</td>
            <td>{member.jobTitle}</td>
            <td>{member.department}</td>
            <td>{member.status}</td>
            <td>
              <button onClick={() => onUpdate(member._id)}>Update</button>
              <button onClick={() => onDelete(member._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StaffTable;
