import React, { useState, useEffect, Fragment } from "react";

import Board from "./components/board/Board";
import History from "./components/history/History";
import "./App.css";

const Game = () => {
  const [boardSize, setBoardSize] = useState(3); // Default board size is 3
  const [squaresArray, setSquaresArray] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState();
  const [numOfFilledSquares, setNumOfFilledSquares] = useState(0);
  const [showBoard, setShowBoard] = useState(false); // State to control whether to show the board or not

  const getAllSolutions = () => {
    const solutions = [];
    const diagonal1 = [];
    const diagonal2 = [];

    for (let rowIndex = 0; rowIndex < boardSize; rowIndex++) {
      const rowSolution = [];
      const columnSolution = [];
      diagonal1.push(rowIndex * boardSize + rowIndex);
      diagonal2.push(rowIndex * boardSize + (boardSize - rowIndex - 1));
      const rowStart = rowIndex * boardSize;
      for (let columnIndex = 0; columnIndex < boardSize; columnIndex++) {
        rowSolution.push(rowStart + columnIndex);
        columnSolution.push(columnIndex * boardSize + rowIndex);
      }
      solutions.push(rowSolution);
      solutions.push(columnSolution);
    }

    solutions.push(diagonal1);
    solutions.push(diagonal2);

    return solutions;
  };

  const solutions = getAllSolutions();

  const squareClickHandler = (squareNumber) => () => {
    if (squaresArray[squareNumber] || winner) return;
    setNumOfFilledSquares((prev) => prev + 1);
    const value = xIsNext ? "X" : "O";
    squaresArray[squareNumber] = { value: value, winner: "" };
    const newHistory = [...history];
    newHistory.push(
      `ผู้เล่น ${xIsNext ? "X" : "O"} เลือกช่อง ${squareNumber + 1}`
    );
    setHistory(newHistory);
    setXIsNext((prev) => !prev);
  };

  const whoWon = () => {
    for (
      let solutionIndex = 0;
      solutionIndex < solutions.length;
      solutionIndex++
    ) {
      const solution = solutions[solutionIndex];
      let firstSquare = squaresArray[solution[0]];
      if (!firstSquare) continue;
      firstSquare = firstSquare.value;
      if (
        solution.reduce(
          (acc, squareIndex) =>
            acc &&
            squaresArray[squareIndex] &&
            firstSquare === squaresArray[squareIndex].value,
          true
        )
      ) {
        solution.map(
          (squareIndex) =>
            (squaresArray[squareIndex] = {
              ...squaresArray[squareIndex],
              winner: "winner",
            })
        );
        return firstSquare;
      }
    }
  };

  const resetHandler = () => {
    setXIsNext(true);
    setSquaresArray([]);
    setWinner();
    setHistory([]);
    setNumOfFilledSquares(0);
  };

  const changeSizeHandler = () => {
    setShowBoard(false); // Reset showBoard state
  };

  const handleBoardSizeSubmit = (e) => {
    e.preventDefault();
    setShowBoard(true);
  };

  const saveHistory = async () => {
    const boardSize = "3x3";
    const winner = "Player X";
    console.log("Now1");
    try {
      const response = await fetch("http://localhost:3000/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ boardSize, winner }),
      });
      console.log(response);
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setWinner(whoWon());
  }, [xIsNext]);

  let titleText;
  if (winner) titleText = `${winner} เป็นผู็ชนะ!!!`;
  else {
    if (numOfFilledSquares === boardSize * boardSize) titleText = `เสมอ`;
    else titleText = `ผู้เล่น ${xIsNext ? "X" : "O"}'เป็นคนถัดไป`;
  }

  return (
    <div className="game-area">
      {!showBoard && (
        <form onSubmit={handleBoardSizeSubmit}>
          <label htmlFor="boardSizeInput">
            กรอกขนาดของบอร์ดที่ต้องการเล่น:
          </label>
          <input
            type="number"
            min={"1"}
            id="boardSizeInput"
            value={boardSize}
            onChange={(e) => setBoardSize(parseInt(e.target.value))}
          />
          <button type="submit">เริ่มเกม</button>
        </form>
      )}
      {showBoard && (
        <Fragment>
          <h3>{titleText}</h3>
          <Board
            boardSize={boardSize}
            squaresArray={squaresArray}
            squareClickHandler={squareClickHandler}
          />
          <button onClick={resetHandler}>รีเซ็ต</button>
          <button onClick={changeSizeHandler}>เปลี่ยนขนาดบอร์ด</button>
          <button onClick={saveHistory}>บันทึกประวัติการเล่น</button>
          <History history={history} />
        </Fragment>
      )}
    </div>
  );
};

export default Game;
