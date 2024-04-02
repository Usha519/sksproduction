// CourseTile.js
import React from "react";

const CourseTile = ({ count }) => {
  return (
    <div className="course-tile">
      <p className="course-count text-center "><h5>Number of courses</h5><button className="btn btn-dark btn-lg  rounded fw-bold  ">{count}</button></p>
    </div>
  );
};

export default CourseTile;
