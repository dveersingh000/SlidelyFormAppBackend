import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dbFilePath = path.join(__dirname, 'db.json');

// Helper function to read the database
function readDB() {
  const data = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(data);
}

// Helper function to write to the database
function writeDB(data: any) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}

router.get('/', (req, res) => {
  res.send('Welcome to the form submission backend. Available endpoints: /ping, /submit, /read, /delete, /edit, /search');
});

// Ping endpoint
router.get('/ping', (req, res) => {
  res.json(true);
});

// Submit endpoint
router.post('/submit', (req, res) => {
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const submissions = readDB();
  submissions.push({ name, email, phone, github_link, stopwatch_time });
  writeDB(submissions);
  res.status(200).send('Submission received');
});

// Read endpoint
router.get('/read', (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const submissions = readDB();
  if (index < 0 || index >= submissions.length) {
    res.status(404).send('Submission not found');
  } else {
    res.json(submissions[index]);
  }
});

// Delete endpoint
router.delete('/delete', (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const submissions = readDB();
  if (index < 0 || index >= submissions.length) {
    res.status(404).send('Submission not found');
  } else {
    submissions.splice(index, 1);
    writeDB(submissions);
    res.status(200).send('Submission deleted');
  }
});

// Edit endpoint
router.put('/edit', (req, res) => {
  const index = parseInt(req.query.index as string, 10);
  const { name, email, phone, github_link, stopwatch_time } = req.body;
  const submissions = readDB();
  if (index < 0 || index >= submissions.length) {
    res.status(404).send('Submission not found');
  } else {
    submissions[index] = { name, email, phone, github_link, stopwatch_time };
    writeDB(submissions);
    res.status(200).send('Submission updated');
  }
});



// Search endpoint
router.get('/search', (req, res) => {
  const email = req.query.email as string;
  const submissions = readDB();
  const results = submissions.filter((submission: any) => submission.email === email);
  res.json(results);
});

export default router;
