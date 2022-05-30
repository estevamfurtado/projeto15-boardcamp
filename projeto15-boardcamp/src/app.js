import express, { json } from "express";
import cors from "cors";
import chalk from "chalk";

import categoriesRouter from './main/categories/router.js'
import customersRouter from './main/customers/router.js'
import gamesRouter from './main/games/router.js'
import rentalsRouter from './main/rentals/router.js'

const app = express();
app.use(cors());
app.use(json());

// Routes
app.get('/', (req, res) => { res.send('Hello World') });
app.use('/categories', categoriesRouter);
app.use('/customers', customersRouter);
app.use('/games', gamesRouter);
app.use('/rentals', rentalsRouter);

export default app;