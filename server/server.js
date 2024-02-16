import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import cors from "cors";
import DescopeClient from '@descope/node-sdk';

import userRoutes from './routes/userRoutes.js';

const descopeClient = DescopeClient({ projectId: 'P2cOme2TpCnULgRmOa2KcSTPRgS9' });



const server = express();
let PORT = 3000;


server.use(express.json());
server.use(cors());



mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
})

server.use('/', userRoutes); 

server.get("/" ,(req, res) => {
    res.send("Seccessfully Connect")
})



server.listen(PORT, () => {
    console.log('listening on port -> ' + PORT);
});