import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import cors from "cors";

import userRoutes from './routes/userRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import commentRoutes from './routes/commentRoutes.js';


const server = express();
let PORT = 3000;


server.use(express.json());
server.use(cors());
server.use(express.static('uploads'))




mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

server.use('/', userRoutes); 
server.use('/blog', blogRoutes); 
server.use('/comment', commentRoutes); 


server.get("/" ,(req, res) => {
    res.send("Seccessfully Connect")
})



server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT);
});