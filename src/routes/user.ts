import { Router } from 'express';
import { initDb } from '../db/database';

const router = Router();

router.get('/user', async (req, res) => {
  const db = await initDb();

  const users = await db.all('SELECT * FROM users');

  res.json(users);
});

router.post('/user', async (req, res) => {
  const { name } = req.body;

  const db = await initDb();

  const user = await db.get('SELECT * FROM users WHERE name = ?', [name]);

  if (user) {
    try {
      user.bingo_grid = JSON.parse(user.bingo_grid);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to parse bingo_grid' });
    }
  } else {
    const bingoGrid = generateBingoGrid();
    const result = await db.run(
      'INSERT INTO users (name, bingo_grid) VALUES (?, ?)',
      [name, JSON.stringify(bingoGrid)]
    );

    const newUser = {
      id: result.lastID,
      name,
      bingo_grid: bingoGrid
    };

    res.json(newUser);
  }
});

router.put('/user/:name/bingo', async (req, res) => {
  const { name } = req.params;
  const { bingo_grid } = req.body;

  if (!Array.isArray(bingo_grid)) {
    return res.status(400).json({ error: 'Invalid bingo grid format' });
  }

  const db = await initDb();

  try {
    const result = await db.run(
      'UPDATE users SET bingo_grid = ? WHERE name = ?',
      [JSON.stringify(bingo_grid), name]
    );

    if (result.changes ?? 0 > 0) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bingo grid' });
  }
});

const generateBingoGrid = () => {
  const items = [
    'Mot1', 'Mot2', 'Mot3', 'Mot4', 'Mot5',
    'Mot6', 'Mot7', 'Mot8', 'Mot9', 'Mot10',
    'Mot11', 'Mot12', 'Mot13', 'Mot14', 'Mot15',
    'Mot16', 'Mot17', 'Mot18', 'Mot19', 'Mot20',
    'Mot21', 'Mot22', 'Mot23', 'Mot24', 'Mot25'
  ];
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25).map(item => ({ item, checked: false }));
};

export default router;
