import express from 'express';
import comandaProdutoService from "../services/comandaService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/comanda/:id', async(req, res, next) =>{
    const comandaID = req.params.id;
     
    try {
        const comanda = await comandaProdutoService.buscarComandaPorId(comandaID);

        logger.info(`Comanda id ${comandaID} encontrada: ${JSON.stringify(comanda)}`);
        res.json(comanda);
    } catch (error) {
        next(error);
    }
});

router.get('/comandas', async (req, res) => {
    try {
        const comandas = await comandaProdutoService.buscarTodasComandas();

        if (comandas.length === 0) {
            logger.warn('Nenhuma comanda encontrada!');
            return res.status(404).send('Nenhuma comanda encontrada!'); 
        }

        logger.info(`Comandas encontradas: ${JSON.stringify(comandas)}`);
        res.json(comandas);
    } catch (error) {
        logger.error(`Erro ao buscar comanda: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
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
                logger.warn(`Erro ao criar comanda! Comanda com codigo ${comanda.codigo_comanda} ja existe!`);
                return res.status(400).send(`Erro ao criar comanda! Comanda com codigo ${comanda.codigo_comanda} ja existe!`);
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
        logger.error(`Erro ao criar comanda: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
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
        res.status(204).send();

    } catch (error){
        logger.error(`Erro ao deletar comanda: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
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
        res.status(200).json({message: 'Comanda atualizada com sucesso!', comanda: comandaUpdate.data_update_comanda});

    } catch(error) {
        logger.error(`Erro ao atualizar comanda: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

export default router;