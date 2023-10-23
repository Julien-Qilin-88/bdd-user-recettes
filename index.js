import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import router from './app/router.js';
import { initSequelize } from './app/shared/database.js';

await initSequelize();

const userRoot = '/user';

dotenv.config();

const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configuration du middleware CORS pour autoriser uniquement l'origine http://localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type',
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(userRoot, router);

app.listen(port, () => {
    console.log(`Le serveur est lancé sur le port ${port}`);
});