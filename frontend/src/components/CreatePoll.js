import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

/**
 * Component that allows authenticated users to create a new poll.
 */
const CreatePoll = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Update the option value at a given index.
   * @param {number} index
   * @param {string} value
   */
  const handleOptionChange = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)));
  };

  /**
   * Add a new option field.
   */
  const addOption = () => {
    setOptions((prev) => [...prev, '']);
  };

  /**
   * Remove an option at a given index (must keep at least two).
   * @param {number} index
   */
  const removeOption = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Submit the new poll to the server.
   * @param {React.FormEvent} e
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    // Validate inputs
    if (!question.trim()) {
      setError('Question is required');
      return;
    }
    const filteredOptions = options.map((opt) => opt.trim()).filter((opt) => opt !== '');
    if (filteredOptions.length < 2) {
      setError('Please provide at least two options');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/polls', {
        question: question.trim(),
        options: filteredOptions,
      });
      // Redirect to poll detail page
      navigate(`/polls/${res.data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create a New Poll</h2>
      {error && <div style={{ color: '#dc3545', marginBottom: '10px' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="question">Question</label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Options</label>
          {options.map((opt, index) => (
            <div
              key={index}
              style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
            >
              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                style={{ flexGrow: 1, padding: '8px' }}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  style={{
                    marginLeft: '5px',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 8px',
                    borderRadius: '3px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            style={{
              backgroundColor: '#6c757d',
              color: '#fff',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '5px',
            }}
          >
            Add Option
          </button>
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '3px',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Creating...' : 'Create Poll'}
        </button>
      </form>
    </div>
  );
};

export default CreatePoll;