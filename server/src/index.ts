import express from 'express';
import mongoose from 'mongoose';
import AuthRoutes from './routes/auth';
import NotesRoutes from './routes/notes';
const app = express();
const port = 8001;
import env from 'dotenv';
import cors from 'cors';
env.config();

app.use(cors());
app.use(express.json());
app.use('/api/auth', AuthRoutes);
app.use('/api/notes', NotesRoutes);

app.get('/', (req, res) => {
    res.send('Hello!');
});
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/assignment')
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error);
    });

app.listen(port, () => {
    return console.log(`Server Running on at http://localhost:${port}`);
});

