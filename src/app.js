import cors from 'cors';
import express from 'express';
import comandaProdutoController from './controllers/comandaProdutoController.js';
import logger from './config/logger.js';

const app = express();
const PORT = 3000;

app.use(cors({origin:'http://127.0.0.1:5500'}));
app.use(express.json());

app.use('/', comandaProdutoController);

app.use((err, req, res, next) => {
    logger.error(`Erro na requisição ${req.method} ${req.url} - ${err.message}`);
    res.status(500).send('Erro interno no servidor');
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});