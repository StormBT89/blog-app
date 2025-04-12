import express from 'express';
import moongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

moongoose.connect(process.env.MONGO).then(
    () => {
    console.log('MOngoDB is connected');
}).catch(err => {
    console.log(err);
})
const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
