const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
//app.use(cors());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

//const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT;
//const SECRET_KEY = process.env.SECRET_KEY || 'eVotingSecretKey';
const SECRET_KEY = process.env.SECRET_KEY;

// Simulasi database
let users = [
  { id: 1, username: 'user1', password: 'password1', hasVoted: false },
  { id: 2, username: 'user2', password: 'password2', hasVoted: false }
];

let candidates = [
  { id: 1, name: 'Kandidat A', votes: 0 },
  { id: 2, name: 'Kandidat B', votes: 0 },
  { id: 3, name: 'Kandidat C', votes: 0 }
];

// Middleware autentikasi
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Username atau password salah');
  }
});

// Get Kandidat
app.get('/candidates', authenticateToken, (req, res) => {
  res.json(candidates);
});

// Voting
app.post('/vote', authenticateToken, (req, res) => {
  const { candidateId } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (user.hasVoted) {
    return res.status(403).send('Anda sudah melakukan voting');
  }

  const candidate = candidates.find(c => c.id === candidateId);
  if (candidate) {
    candidate.votes += 1;
    user.hasVoted = true;
    res.send('Voting berhasil');
  } else {
    res.status(404).send('Kandidat tidak ditemukan');
  }
});

// Hasil Voting
app.get('/results', authenticateToken, (req, res) => {
  res.json(candidates);
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});