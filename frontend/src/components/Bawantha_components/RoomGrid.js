import React from "react";

const RoomGrid = ({ rooms, onFilter }) => {
  const totalRooms = 30;
  // const columns = 5;

  const getRoomStatus = (roomNumber) => {
    const room = rooms.find((r) => r.roomNumber === `R0${roomNumber}`);
    return room ? "bg-green-500 text-white" : "bg-red-500 text-white";
  };

  return (
    <div className="p-1 bg-white shadow-md rounded-lg">
      {/* <h3 className="text-xl font-semibold mb-4">All Rooms</h3> */}
      <div className="grid grid-cols-5 gap-1 ">
        {[...Array(totalRooms)].map((_, index) => {
          const roomNumber = index + 1;
          return (
            <button
              key={roomNumber}
              className={`p-2 rounded-lg ${getRoomStatus(roomNumber)} hover:opacity-80`}
              onClick={() => onFilter(roomNumber)}
            >
              R{roomNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoomGrid;
