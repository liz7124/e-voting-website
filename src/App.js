import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

export default function App() {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState([]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, { username, password });
      setToken(response.data.token);
      fetchCandidates(response.data.token);
    } catch (error) {
      alert('Login gagal!');
    }
  };

  const fetchCandidates = async (authToken) => {
    try {
      const response = await axios.get(`${API_URL}/candidates`, {
        headers: { Authorization: authToken }
      });
      setCandidates(response.data);
    } catch (error) {
      console.error('Gagal mengambil data kandidat');
    }
  };

  const vote = async (candidateId) => {
    try {
      await axios.post(`${API_URL}/vote`, { candidateId }, {
        headers: { Authorization: token }
      });
      setHasVoted(true);
      fetchResults();
    } catch (error) {
      alert('Voting gagal atau Anda sudah memilih');
    }
  };

  const fetchResults = async () => {
    try {
      const response = await axios.get(`${API_URL}/results`, {
        headers: { Authorization: token }
      });
      setResults(response.data);
    } catch (error) {
      console.error('Gagal mengambil hasil voting');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      {!token ? (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
          <h1 className="text-xl font-bold mb-4">Login E-Voting</h1>
          <input 
            type="text" 
            placeholder="Username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            className="w-full p-2 mb-3 border rounded-lg" 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 mb-3 border rounded-lg" 
          />
          <button 
            onClick={handleLogin} 
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-96">
          <h1 className="text-xl font-bold mb-4">Daftar Kandidat</h1>
          {candidates.map(candidate => (
            <div key={candidate.id} className="flex justify-between items-center mb-3">
              <span>{candidate.name}</span>
              <button 
                onClick={() => vote(candidate.id)} 
                className="bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600"
                disabled={hasVoted}
              >
                Pilih
              </button>
            </div>
          ))}
          {hasVoted && (
            <div>
              <h2 className="text-lg font-bold mt-4">Hasil Voting</h2>
              {results.map(result => (
                <p key={result.id}>{result.name}: {result.votes} suara</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}