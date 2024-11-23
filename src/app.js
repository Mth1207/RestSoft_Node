import cors from 'cors';
import express from 'express';
import comandaController from './controllers/comandaController.js';
import produtoController from './controllers/produtoController.js';
import processamentoController from './controllers/processamentoController.js';
import errorHandler from './utils/exceptions/exceptions.js';

const app = express();
const PORT = 3000;

app.use(cors({origin:'http://127.0.0.1:5500'}));
app.use(express.json());

app.use('/', comandaController, produtoController, processamentoController);

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
 