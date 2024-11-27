import express from 'express';
import comandaService from "../services/comandaService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/comanda/:id', async(req, res, next) =>{
    const comandaID = req.params.id;
     
    try {
        const comanda = await comandaService.buscarComandaPorId(comandaID);

        logger.info(`Comanda id ${comandaID} encontrada: ${JSON.stringify(comanda)}`);
        res.status(200).json({comanda});
    } catch (error) {
        next(error);
    }
});

router.get('/comandas', async (req, res, next) => {
    try {
        const comandas = await comandaService.buscarTodasComandas();

        logger.info(`Comandas encontradas: ${JSON.stringify(comandas)}`);
        res.status(200).json({comandas});
    } catch (error) {
        next(error);
    }
});

router.post('/add-comanda', async(req, res, next) => {
    const comanda = {
        codigo_comanda: req.body.codigo_comanda,
        valor_total: req.body.valor_total
    };

    try {
        
        if(!comanda.codigo_comanda || comanda.valor_total === null || comanda.valor_total === undefined){
            const error = new Error(`Erro ao criar comanda! Campos obrigatórios nulos!`);
            error.status = 400;
            throw error;
        }
        
        const check = await comandaService.buscarTodasComandas();

        const codigoExistente = check.some((codigo) => codigo.codigo_comanda === comanda.codigo_comanda);
        if(codigoExistente) {
            const error = new Error(`Erro ao criar comanda! Comanda com código ${comanda.codigo_comanda} já existe!`);
            error.status = 400;
            throw error;
        }

        const comandaID = await comandaService.criarComanda(comanda.codigo_comanda, comanda.valor_total);
        const novaComanda = await comandaService.buscarComandaPorId(comandaID);

        logger.info('Comanda criada com sucesso!');
        res.status(201).json({message: 'Comanda criada com sucesso!', comanda: novaComanda});

     } catch (error) {
        next(error);
    }
});

router.delete('/delete-comanda/:id', async(req, res, next) => {
    const comandaID = req.params.id;

    try {

        await comandaService.deletarComanda(comandaID);
        
        logger.info(`Comanda com id: ${comandaID} deletada com sucesso!`);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
});

router.put('/update-comanda/:id', async(req, res, next) => {
    const comandaID = req.params.id;

    const comanda = {
        codigo_comanda: req.body.codigo_comanda,
        valor_total: req.body.valor_total
    };
    
    try {
        const comandaUpdate = await comandaService.atualizarComanda(comandaID, comanda.codigo_comanda, comanda.valor_total);

        logger.info(`Comanda com id ${comandaID}, atualizada com sucesso!`);
        res.status(200).json({
            mensagem: 'Comanda atualizada com sucesso!',
            dados: comandaUpdate
        });

    } catch(error) {
        next(error);
    }
});

export default router;