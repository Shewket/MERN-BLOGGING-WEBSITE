import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import cors from "cors";

import userRoutes from './routes/userRoutes.js';




const server = express();
let PORT = 3000;


server.use(express.json());
server.use(cors());



mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

server.use('/', userRoutes); 



server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT);
});