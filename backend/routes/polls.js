const express = require('express');
const Poll = require('../models/Poll');
const { authMiddleware } = require('./auth');

const router = express.Router();

/**
 * @route   GET /api/polls
 * @desc    Get all polls
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find().select('-voters').sort({ createdAt: -1 });
    res.json(polls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   GET /api/polls/:id
 * @desc    Get a single poll by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    res.json(poll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/polls
 * @desc    Create a new poll
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { question, options } = req.body;
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res
        .status(400)
        .json({ message: 'Question and at least two options are required' });
    }
    const trimmedOptions = options.map((opt) => opt.trim()).filter((opt) => opt !== '');
    if (trimmedOptions.length < 2) {
      return res
        .status(400)
        .json({ message: 'Please provide at least two non-empty options' });
    }
    // Initialize votes array with zeros matching options length
    const votes = new Array(trimmedOptions.length).fill(0);
    const newPoll = new Poll({
      question: question.trim(),
      options: trimmedOptions,
      votes,
      createdBy: req.user.userId,
    });
    const savedPoll = await newPoll.save();
    res.status(201).json(savedPoll);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * @route   POST /api/polls/:id/vote
 * @desc    Vote on a poll
 * @access  Private
 */
router.post('/:id/vote', authMiddleware, async (req, res) => {
  try {
    const pollId = req.params.id;
    const { choice } = req.body;
    const userId = req.user.userId;
    if (choice === undefined) {
      return res.status(400).json({ message: 'Choice index is required' });
    }
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    // Check if user already voted
    const alreadyVoted = poll.voters.some((v) => v.user.toString() === userId);
    if (alreadyVoted) {
      return res.status(400).json({ message: 'You have already voted on this poll' });
    }
    const choiceIndex = parseInt(choice, 10);
    if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= poll.options.length) {
      return res.status(400).json({ message: 'Invalid choice index' });
    }
    // Increment vote count
    poll.votes[choiceIndex] += 1;
    // Record voter
    poll.voters.push({ user: userId, choice: choiceIndex });
    await poll.save();
    res.json({ message: 'Vote recorded', poll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;