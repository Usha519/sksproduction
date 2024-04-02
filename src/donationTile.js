// DevoteeTile.js
import React from "react";


const DonationTile = ({ count }) => {
  return (
    <div className="course-tile">
      <p className="course-count text-center "><h5>Number of donations</h5><button className="btn btn-dark rounded fw-bold  ">{count}</button></p>
    </div>
  );
};

export default DonationTile;
