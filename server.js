const express = require("express");
const mysql = require("mysql");

const app = express();
const port = 3000;

app.use(express.json());

// MySQL connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "game_xo",
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: ", err);
    return;
  }
  console.log("Connected to MySQL database");
});

// API endpoint to insert data
app.post("/history", (req, res) => {
  const { boardSize, winner } = req.body;
  const insertQuery = `INSERT INTO History (boardSize, winner) VALUES (?, ?)`;
  connection.query(insertQuery, [boardSize, winner], (err, result) => {
    if (err) {
      console.error("Error inserting data: ", err);
      res.status(500).json({ error: "Failed to insert data" });
      return;
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
