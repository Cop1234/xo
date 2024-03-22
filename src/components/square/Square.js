import React from "react";

import "./Square.css";

const Square = ({ params, onClick }) => {
  return (
    <button
      className={`square ${params ? params.value + " " + params.winner : ""}`}
      onClick={onClick}
    >
      {params ? params.value : ""}
    </button>
  );
};

export default Square;
