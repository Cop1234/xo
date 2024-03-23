const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "game_xo",
});

app.get("/record", (req, res) => {
  connection.query("SELECT * FROM game_xo.history", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/saveRecord", (req, res) => {
  const boardSize = req.body.boardSize;
  const winner = req.body.winner;
  connection.query(
    "INSERT INTO History (boardSize, winner) VALUES (?, ?)",
    [boardSize, winner],
    (err, results) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values inserted");
      }
    }
  );
});

app.listen("3001", () => {
  console.log("Server is running on port 3001");
});
