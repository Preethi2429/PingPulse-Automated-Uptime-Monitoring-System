import express from 'express';
import Monitor from '../models/Monitor.js'; // Note: In ES Modules, you MUST add .js extension

const router = express.Router();

/* -------------------------------------------
   1. CREATE (POST): Add a new website to track
   ------------------------------------------- */
router.post('/', async (req, res) => {
  try {
    const { name, url } = req.body; 

    const newMonitor = new Monitor({ 
        name,  // shorthand for name: name
        url 
    });

    const savedMonitor = await newMonitor.save();
    res.status(201).json(savedMonitor);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------
   2. READ (GET): Get all tracked websites
   ------------------------------------------- */
router.get('/', async (req, res) => {
  try {
    const monitors = await Monitor.find();
    res.status(200).json(monitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------------------------------
   3. DELETE (DELETE): Remove a website
   ------------------------------------------- */
router.delete('/:id', async (req, res) => {
  try {
    await Monitor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Monitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;