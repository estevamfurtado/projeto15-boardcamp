import dotenv from "dotenv";
import app from "./app.js";
import chalk from 'chalk';

dotenv.config();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(chalk.bold.green(`Servidor em pé na porta ${port}`)));