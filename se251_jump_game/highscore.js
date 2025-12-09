const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

// Allow requests from Live Server (127.0.0.1:5500)
app.use(cors({ origin: "http://127.0.0.1:5500" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const scoreFile = path.join(__dirname, 'data', 'jeep.json');

app.get('/bob', (req, res) => {
 const filePath = path.join(__dirname, `public`, `index.html`)
  res.sendFile(filePath);
});


// Get scores
app.get('/jeep', (req, res) => {
  let scores = [];
  try {
    if (fs.existsSync(scoreFile)) {
      const data = fs.readFileSync(scoreFile, 'utf8');
      scores = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error reading scores:", err);
  }
  res.json(scores);
});

// Save new score
app.post('/jeep', (req, res) => {
  console.log("Incoming body:", req.body);
  const { name, score } = req.body;
  let scores = [];

  try {
    if (fs.existsSync(scoreFile)) {
      const oldData = fs.readFileSync(scoreFile, 'utf8');
      scores = JSON.parse(oldData);
    }
  } catch (err) {
    scores = [];
  }

  scores.push({ name, score: Number(score) });
  scores.sort((a, b) => b.score - a.score);
  scores = scores.slice(0, 5);

  try {
    fs.writeFileSync(scoreFile, JSON.stringify(scores, null, 2));
    console.log("Updated scores:", scores);
    res.json(scores);
  } catch (err) {
    console.error("Error writing file", err);
    res.status(500).send("Error saving score");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

