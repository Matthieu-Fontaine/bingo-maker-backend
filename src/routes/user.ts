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
    'Marie aigri', 'Matthieu agonie', 'Chute sur notre tente', 'Julia agonie', 'Se faire volé un truc au camping',
    'Lorenzo absent... ', 'Mangé des nouilles à 2€', 'Arrivé au festival ?', 'Le bingo y fonctionne plus', 'Eau potable pas potable',
    'Le degueulis', 'Changement de tente', 'Insolation', 'New private joke', 'Malade (bonus tourista)',
    'Attendre 2 heures pour la douche', 'Pluie de grêlons', 'Musique claqué au sol', 'Embrouille avec un random', 'Perdre quelqu\'un',
    'Pogo géant', 'Annulation d\'un concert banger', 'G mal au pied', 'Porté moi svp', 'G pu d\'idée'
  ];
  const shuffled = items.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 25).map(item => ({ item, checked: false }));
};

export default router;
