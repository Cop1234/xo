import React, { useState, useEffect, Fragment } from "react";

import Board from "./components/board/Board";
import History from "./components/history/History";
import Axios from "axios";
import "./App.css";

const Game = () => {
  const [boardSize, setBoardSize] = useState(3); // Default board size is 3
  const [squaresArray, setSquaresArray] = useState([]);
  const [xIsNext, setXIsNext] = useState(true);
  const [history, setHistory] = useState([]);
  const [winner, setWinner] = useState();
  const [numOfFilledSquares, setNumOfFilledSquares] = useState(0);
  const [showBoard, setShowBoard] = useState(false);
  const [record, setRecord] = useState([]);

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
    setShowBoard(false);
    setXIsNext(true);
    setSquaresArray([]);
    setWinner();
    setHistory([]);
    setNumOfFilledSquares(0);
  };

  const handleBoardSizeSubmit = (e) => {
    e.preventDefault();
    setShowBoard(true);
  };

  const getRecord = () => {
    Axios.get("http://localhost:3001/record").then((response) => {
      setRecord(response.data);
    });
  };

  const saveRecord = () => {
    const boardSizeString = boardSize + " X " + boardSize;
    Axios.post("http://localhost:3001/saveRecord", {
      boardSize: boardSizeString,
      winner: winnerResult,
    }).then(() => {
      setRecord([
        ...record,
        {
          boardSize: boardSizeString,
          winner: winnerResult,
        },
      ]);
    });
    window.alert("บันทึกเสร็จสิ้น");
    setShowBoard(false);
    setXIsNext(true);
    setSquaresArray([]);
    setWinner();
    setHistory([]);
    setNumOfFilledSquares(0);
  };

  useEffect(() => {
    setWinner(whoWon());
  }, [xIsNext]);

  let titleText;
  let winnerResult;
  if (winner) titleText = `ผู้เล่น ${winner} ชนะ!!!`;
  else {
    if (numOfFilledSquares === boardSize * boardSize) titleText = `เสมอ`;
    else titleText = `ผู้เล่น ${xIsNext ? "X" : "O"} เลือกช่อง`;
  }
  winnerResult = titleText;

  return (
    <div className="game-area">
      <div className="show-board">
        <h1>Tic Tac Toe</h1>
        {!showBoard && (
          <form onSubmit={handleBoardSizeSubmit}>
            <div className="title">
              <label className="Text" htmlFor="boardSizeInput">
                กรอกขนาดของบอร์ดที่ต้องการเล่น:
              </label>
              <input
                type="number"
                min={"1"}
                id="boardSizeInput"
                value={boardSize}
                onChange={(e) => setBoardSize(parseInt(e.target.value))}
              />
              <button type="submit" className="btnSubmit">
                เริ่มเกม
              </button>
            </div>
          </form>
        )}
        {showBoard && (
          <Fragment>
            <h3 className="Text">{titleText}</h3>
            <Board
              boardSize={boardSize}
              squaresArray={squaresArray}
              squareClickHandler={squareClickHandler}
            />
            <div className="option">
              <button onClick={resetHandler} className="btnReset">
                รีเซ็ต
              </button>
              <button onClick={changeSizeHandler} className="btnChangeBoard">
                เปลี่ยนขนาดบอร์ด
              </button>
            </div>
            {titleText !== "เสมอ" ||
              (winner && (
                <Fragment>
                  <label className="Text" htmlFor="boardSizeInput">
                    คุณต้องการบันทึกประวัติการเล่นหรือไม่ ?
                  </label>
                  <button onClick={saveRecord} className="btnSave">
                    บันทึก
                  </button>
                </Fragment>
              ))}
          </Fragment>
        )}

        {!showBoard && (
          <Fragment>
            <button onClick={getRecord} className="btnCheckRecord">
              ดูประวัติการเล่น
            </button>
            <table className="record-table">
              <thead>
                <tr>
                  <th>บอร์ด</th>
                  <th>ผลการแข่ง</th>
                </tr>
              </thead>
              <tbody>
                {record.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.boardSize}</td>
                      <td>{val.winner}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default Game;
