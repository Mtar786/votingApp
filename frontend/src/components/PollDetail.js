import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

/**
 * Decode a JWT token and extract the userId from its payload.
 * @param {string} token
 * @returns {string|null} userId or null if invalid
 */
function getUserIdFromToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded.userId;
  } catch (err) {
    return null;
  }
}

/**
 * Component that displays a poll, its options, and voting controls.
 * Allows authenticated users to vote if they haven't already.
 *
 * @param {{ user: { token: string, username: string } | null }} props
 */
const PollDetail = ({ user }) => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [voteError, setVoteError] = useState('');
  const [voteSuccess, setVoteSuccess] = useState('');

  const userId = user ? getUserIdFromToken(user.token) : null;

  useEffect(() => {
    const fetchPoll = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/polls/${id}`);
        setPoll(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch poll');
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id]);

  /**
   * Determine whether the current user has already voted in this poll.
   */
  const hasVoted = () => {
    if (!poll || !userId) return false;
    return poll.voters?.some((v) => v.user === userId || v.user?._id === userId || v.user?.toString() === userId);
  };

  /**
   * Handle voting for a specific option.
   * @param {number} index
   */
  const handleVote = async (index) => {
    setVoteError('');
    setVoteSuccess('');
    try {
      const res = await api.post(`/polls/${id}/vote`, { choice: index });
      setPoll(res.data.poll);
      setVoteSuccess('Thank you for voting!');
    } catch (err) {
      console.error(err);
      setVoteError(err.response?.data?.message || 'Failed to record vote');
    }
  };

  if (loading) {
    return <p>Loading poll...</p>;
  }
  if (error) {
    return <p style={{ color: '#dc3545' }}>{error}</p>;
  }
  if (!poll) {
    return null;
  }
  const totalVotes = poll.votes.reduce((sum, v) => sum + v, 0);
  return (
    <div>
      <h2>{poll.question}</h2>
      {voteError && <p style={{ color: '#dc3545' }}>{voteError}</p>}
      {voteSuccess && <p style={{ color: '#28a745' }}>{voteSuccess}</p>}
      <ul style={{ paddingLeft: '0' }}>
        {poll.options.map((option, index) => {
          const votesForOption = poll.votes[index];
          const percent = totalVotes > 0 ? ((votesForOption / totalVotes) * 100).toFixed(1) : 0;
          return (
            <li
              key={index}
              style={{
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '10px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{option}</span>
                <span style={{ color: '#6c757d' }}>
                  {votesForOption} vote{votesForOption !== 1 ? 's' : ''} ({percent}%)
                </span>
              </div>
              {user && !hasVoted() && (
                <button
                  onClick={() => handleVote(index)}
                  style={{
                    marginTop: '5px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  Vote
                </button>
              )}
            </li>
          );
        })}
      </ul>
      <p style={{ fontStyle: 'italic', color: '#6c757d' }}>
        Total Votes: {totalVotes}
      </p>
      {!user && (
        <p style={{ color: '#6c757d' }}>
          <em>Please log in to participate in the poll.</em>
        </p>
      )}
      {user && hasVoted() && (
        <p style={{ color: '#6c757d' }}>
          <em>You have already voted in this poll.</em>
        </p>
      )}
    </div>
  );
};

export default PollDetail;