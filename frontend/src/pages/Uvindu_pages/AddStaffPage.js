import React from "react";
import StaffForm from "../components/Uvindu_components/StaffForm";

const AddStaffPage = () => {
  const handleSubmit = (staff) => {
    console.log("New Staff Member:", staff);
    // You can make an API call here to save the staff data
  };

  return (
    <div>
      <h2>Add New Staff Member</h2>
      <StaffForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddStaffPage;
