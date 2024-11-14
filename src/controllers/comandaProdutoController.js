import express from 'express';
import comandaProdutoService from "../services/comandaProdutoService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/comanda/:id', async(req, res) =>{
    const comandaID = req.params.id;
    logger.info(`Requisição para comanda: ${comandaID}`);
     
    try {
        const comanda = await comandaProdutoService.buscarComandaPorId(comandaID);
        if(!comanda) {
            logger.warn(`Comanda com id ${comandaID} não encontrada!`);
            return res.status(404).send(`Comanda com id ${comandaID} não encontrada!`);
        }

        logger.info(`Comanda id ${comandaID} encontrada: ${JSON.stringify(comanda)}`);
        res.json(comanda);
    } catch (error) {
        logger.error(`Erro ao buscar comanda: ${error.message}`);
        res.status(500).send('Erro interno no servidor!');
    }
});

router.get('/comandas', async (req, res) => {
    logger.info('Requisição para buscar todas as comandas');
    try {
        const comandas = await comandaProdutoService.buscarTodasComandas();

        if (comandas.length === 0) {
            logger.warn('Nenhuma comanda encontrada!');
            return res.status(404).send('Nenhuma comanda encontrada!'); 
        }

        logger.info(`Comandas encontradas: ${JSON.stringify(comandas)}`);
        res.json(comandas);
    } catch (error) {
        logger.error('Erro ao buscar comandas: ', error.message);
        res.status(500).send('Erro interno no servidor!');
    }
});

router.post('/add-comanda', async(req, res) => {
    const comanda = {
        codigo_comanda: req.body.codigo_comanda,
        valor_total: req.body.valor_total
    };

    try {
        const check = await comandaProdutoService.buscarTodasComandas();

        console.log(check);
        for (let i = 0; i < check.length; i++) {
            if(check[i].codigo_comanda === comanda.codigo_comanda) {
                logger.warn('Erro ao criar comanda! Comanda com esse codigo ja existe!');
                return res.status(400).send('Erro ao criar comanda! Comanda com esse codigo ja existe!');
            }
        };

        if(!comanda.codigo_comanda || comanda.valor_total === null) {
            logger.warn('Erro ao criar comanda! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao criar comanda! Campos obrigatórios nulos!');
        };

        const comandaID = await comandaProdutoService.criarComanda(comanda.codigo_comanda, comanda.valor_total);

        const novaComanda = await comandaProdutoService.buscarComandaPorId(comandaID);

        logger.info('Comanda criada com sucesso!');
        res.status(201).json({message: 'Comanda criada com sucesso!', comanda: novaComanda});

     } catch (error) {
        logger.error(`Erro ao criar comanda: ${error.message}`);
        res.status(500).send('Erro interno no servidor!');
    }
});

router.delete('/delete-comanda/:id', async(req, res) => {
    const comandaID = req.params.id;

    try {
        const verificaID = await comandaProdutoService.buscarComandaPorId(comandaID);

        if(!verificaID) {
            logger.warn(`Comanda inexistente! Comanda: ${comandaID}`);
            return res.status(404).send('Comanda inexistente!');
        }
        const comandaDelete = await comandaProdutoService.deletarComanda(comandaID);
        
        logger.info(`Comanda com id: ${comandaID} deletada com sucesso!`);
        res.status(204).json({message: 'Comanda deletada com sucesso!', comandaDelete});

    } catch (error){
        logger.error(`Erro ao deletar comanda: ${error.message}`);
        res.status(500).send('Erro interno no servidor!');
    }
});

router.put('/update-comanda/:id', async(req, res) => {
    const comandaID = req.params.id;

    const comanda = {
        codigo_comanda: req.body.codigo_comanda,
        valor_total: req.body.valor_total
    };
    
    try {
        const verificaID = await comandaProdutoService.buscarComandaPorId(comandaID);
        if(!verificaID) {
            logger.warn(`Comanda com id ${comandaID} inexistente!`);
            return res.status(404).send('Comanda inexistente!');
        }

        if(!comanda.codigo_comanda || comanda.valor_total === null) {
            logger.warn('Erro ao atualizar comanda! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao atualizar comanda! Campos obrigatórios nulos!');
        }

        const comandaUpdate = await comandaProdutoService.atualizarComanda(comandaID, comanda.codigo_comanda, comanda.valor_total);

        logger.info(`Comanda com id ${comandaID}, atualizada com sucesso!`);
        res.status(200).json({message: 'Comanda atualizada com sucesso!', comandaUpdate});

    } catch(error) {
        logger.error(`Erro ao atualiza comanda: ${error.message}`);
        res.status(500).send('Erro interno no servidor!');
    }
});

export default router;