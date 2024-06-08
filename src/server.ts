import express from 'express';
import cors from 'cors';
import userRouter from './routes/user';
import bingoContentRoutes from './routes/bingoContent';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', userRouter);
app.use('/api', bingoContentRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
