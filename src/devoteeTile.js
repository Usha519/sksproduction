// DevoteeTile.js
import React from "react";


const DevoteeTile = ({ count }) => {
  return (
    
    <div className="devotee-tile">
      <p className="devotee-count text-center "><h5>Number of devotees</h5><button className="btn btn-dark rounded fw-bold ">{count}</button></p>
    </div>
    
  );
};

export default DevoteeTile;
