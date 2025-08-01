import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

/**
 * Component to display a list of all polls.
 */
const PollsList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPolls = async () => {
      setLoading(true);
      try {
        const res = await api.get('/polls');
        setPolls(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch polls');
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading) {
    return <p>Loading polls...</p>;
  }

  if (error) {
    return <p style={{ color: '#dc3545' }}>{error}</p>;
  }

  return (
    <div>
      <h2>All Polls</h2>
      {polls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        <ul style={{ paddingLeft: '0' }}>
          {polls.map((poll) => {
            const totalVotes = poll.votes?.reduce((sum, v) => sum + v, 0) || 0;
            return (
              <li
                key={poll._id}
                style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#fff',
                }}
              >
                <Link to={`/polls/${poll._id}`} style={{ color: '#007bff', fontWeight: 'bold' }}>
                  {poll.question}
                </Link>
                <div style={{ fontSize: '0.9rem', color: '#6c757d' }}>
                  {poll.options.length} options • {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PollsList;