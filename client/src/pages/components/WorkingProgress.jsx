import React from "react";

function WorkingProgress({ children }) {
  return (
    <div className="relative">
      <div className="absolute bg-white w-full h-full flex justify-center items-center opacity-90">
        Work in Progress
      </div>
      {children}
    </div>
  );
}

export default WorkingProgress;
