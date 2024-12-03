import express from "express";
import processamentoService from "../services/processamentoService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/process/:id', async(req, res, next) => {
    const processID = req.params.id;

    try {
        const process = await processamentoService.buscarProcessamentoPorId(processID);

        logger.info(`Processamento com id ${processID} encontrado: ${JSON.stringify(process)}`);
        res.status(200).json({process});
    } catch (error) {
        next(error);
    }
});

router.get('/process', async(req, res, next) => {
    try {
        const processamentos = await processamentoService.buscarTodosProcessamentos();
        
        logger.info(`Processamentos encontrados: ${JSON.stringify(processamentos)}`);
        res.status(200).json({processamentos});
    }
    catch(error) {
        next(error);
    }
});

router.post('/add-process', async(req, res, next) => {
    const process = {
        comanda_id: req.body.comanda_id,
        produto_id: req.body.produto_id,
        servico_id: req.body.servico_id,
        quantidade_servico: req.body.quantidade_servico,
        quantidade_produto: req.body.quantidade_produto
    }

    try {

        if(!process.comanda_id || !process.produto_id || !process.servico_id || process.quantidade_servico === undefined || process.quantidade_produto === undefined) {
            const error = new Error(`Erro ao criar processamento! Campos obrigatórios nulos!`);
            error.status = 400;
            throw error;
        }

        const processamentoID = await processamentoService.criarProcessamento(process.comanda_id, process.produto_id, process.servico_id, process.quantidade_servico, process.quantidade_produto);
        const novoProcessamento = await processamentoService.buscarProcessamentoPorId(processamentoID);

        logger.info('Processamento adicionado com sucesso!');
        return res.status(201).json({message: 'Processamento adicionado com sucesso!', processamento: novoProcessamento});

    } catch(error){
        next(error);
    };
});

router.delete('/del-process/:id', async(req, res) => {
    const processID = req.params.id;

    try { 

        await processamentoService.deletarProcessamento(processID);
        logger.info(`Processamento com id: ${processID} deletado com sucesso!`);
        res.status(204).send();

    } catch (error) {
        next(error);
    }
});

router.put('/update-process/:id', async(req, res) => {
    const processID = req.params.id;

    const process = {
        comanda_id: req.body.comanda_id,
        produto_id: req.body.produto_id,
        servico_id: req.body.servico_id,
        quantidade_servico: req.body.quantidade_servico,
        quantidade_produto: req.body.quantidade_produto
    };

    try {
        const processUpdate = await processamentoService.atualizarProcessamento(processID, process.comanda_id, process.produto_id, process.servico_id, process.quantidade_servico, process.quantidade_produto);
    
        logger.info(`Processamento com id ${processID} atualizado com sucesso!`);
        res.status(200).json({message: 'Processamento atualizado com sucesso!',
            processamento: processUpdate
        });
    
    } catch(error) {
        next(error);
    }
});


export default router;