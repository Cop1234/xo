import React from "react";

import Square from "../square/Square";
import "./Board.css";

const Board = ({ boardSize, squaresArray, squareClickHandler }) => {
  const buildBoard = () => {
    const board = [];
    for (var rowNumber = 0; rowNumber < boardSize; rowNumber++) {
      const rowStart = rowNumber * boardSize;
      const newRow = [];
      for (var columnNumber = 0; columnNumber < boardSize; columnNumber++) {
        const squareIndex = rowStart + columnNumber;
        newRow.push(
          <Square
            key={squareIndex}
            params={squaresArray[`${squareIndex}`]}
            onClick={squareClickHandler(squareIndex)}
          />
        );
      }
      board.push(
        <div key={rowNumber} className="row">
          {newRow}
        </div>
      );
    }
    return board;
  };

  return buildBoard();
};

export default Board;
