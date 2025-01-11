const express = require('express');
const router = express.Router();
const Trainer = require('../models/Trainer');

// Get all trainers
router.get('/', async (req, res) => {
  try {
    const trainers = await Trainer.find();
    res.json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific trainer by ID
router.get('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json(trainer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new trainer
router.post('/', async (req, res) => {
  const trainer = new Trainer({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    specialization: req.body.specialization,
    experience: req.body.experience,
  });

  try {
    const newTrainer = await trainer.save();
    res.status(201).json(newTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a trainer by ID
router.put('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    trainer.name = req.body.name || trainer.name;
    trainer.email = req.body.email || trainer.email;
    trainer.phone = req.body.phone || trainer.phone;
    trainer.specialization = req.body.specialization || trainer.specialization;
    trainer.experience = req.body.experience || trainer.experience;

    const updatedTrainer = await trainer.save();
    res.json(updatedTrainer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a trainer by ID
router.delete('/:id', async (req, res) => {
  try {
    const trainer = await Trainer.findById(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    await trainer.remove();
    res.json({ message: 'Trainer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;