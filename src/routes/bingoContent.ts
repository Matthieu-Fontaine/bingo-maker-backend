import { Router } from 'express';
import { initDb } from '../db/database';

const router = Router();

// Créer un nouveau contenu
router.post('/bingo-content', async (req, res) => {
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: 'Item is required' });
  }

  const db = await initDb();
  const result = await db.run(
    'INSERT INTO bingo_content (item) VALUES (?)',
    [item]
  );

  res.json({ id: result.lastID, item });
});

// Lire tous les contenus
router.get('/bingo-content', async (req, res) => {
  const db = await initDb();
  const items = await db.all('SELECT * FROM bingo_content');
  res.json(items);
});

// Mettre à jour un contenu existant
router.put('/bingo-content/:id', async (req, res) => {
  const { id } = req.params;
  const { item } = req.body;

  if (!item) {
    return res.status(400).json({ error: 'Item is required' });
  }

  const db = await initDb();
  const result = await db.run(
    'UPDATE bingo_content SET item = ? WHERE id = ?',
    [item, id]
  );

  if (result.changes !== undefined && result.changes > 0) {
    res.json({ id, item });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

// Supprimer un contenu existant
router.delete('/bingo-content/:id', async (req, res) => {
  const { id } = req.params;

  const db = await initDb();
  const result = await db.run(
    'DELETE FROM bingo_content WHERE id = ?',
    [id]
  );

  if (result.changes !== undefined && result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

export default router;
