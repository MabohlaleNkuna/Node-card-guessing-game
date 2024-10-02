const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/scores', (req, res) => {
  const scoresPath = path.join(__dirname, 'data', 'scores.json');
  fs.readFile(scoresPath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Error loading scores' });
    }
    res.json(JSON.parse(data));
  });
});

app.post('/save-score', express.json(), (req, res) => {
  const { username, time } = req.body;
  const scoresPath = path.join(__dirname, 'data', 'scores.json');

  fs.readFile(scoresPath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Error reading scores' });

    const scores = JSON.parse(data);
    scores.push({ username, time });
    fs.writeFile(scoresPath, JSON.stringify(scores), err => {
      if (err) return res.status(500).json({ message: 'Error saving score' });
      res.json({ message: 'Score saved successfully' });
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
