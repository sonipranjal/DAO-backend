import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';

//routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(
  cors({
    credentials: false,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

const port = process.env.PORT || 8000;

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, async () => {
  console.log(`Express app listening on localhost:${port}`);
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('database connected!');
  } catch (error) {
    console.log(error);
  }
});
