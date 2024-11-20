import express from "express";
import processamentoService from "../services/processamentoService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/process/:id', async(req, res) => {
    const processID = req.params.id;

    try {
        const process = await processamentoService.buscarProcessamentoPorId(processID);

        if(!process) {
            logger.warn(`Processamento com o id ${processID} não encontrado!`);
            return res.status(404).send(`Processamento com o id ${processID} não encontrado!`);
        }

        logger.info(`Processamento com id ${processID} encontrado: ${JSON.stringify(process)}`);
        res.status(200).json({message: 'Processamento encontrado!', process});
    } catch (error) {
        logger.error(`Erro ao buscar processamento: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

router.get('/process', async(req, res) => {
    try {
        const processamentos = await processamentoService.buscarTodosProcessamentos();
        
        if(processamentos.length === 0) {
            logger.warn('Nenhum processamento encontrado!');
            return res.status(404).send('Nenhum processamento encontrado!');
        }
        logger.info(`Processamentos encontrados: ${JSON.stringify(processamentos)}`);
        res.status(200).json({message: 'Processamentos:', processamentos});
    }
    catch(error) {
        logger.error(`Erro ao buscar processamento: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

router.post('/add-process', async(req, res) => {
    const process = {
        comanda_id: req.body.comanda_id,
        produto_id: req.body.produto_id,
        servico_id: req.body.servico_id,
        quantidade_servico: req.body.quantidade_servico,
        quantidade_produto: req.body.quantidade_produto
    }

    try {

        if(!process.comanda_id || !process.produto_id || !process.servico_id || !process.quantidade_servico || !process.quantidade_produto) {
            logger.warn('Erro ao adicionar processamento! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao adicionar processamento! Campos obrigatórios nulos!');
        }

        const processamentoID = await processamentoService.criarProcessamento(process.comanda_id, process.produto_id, process.servico_id, process.quantidade_servico, process.quantidade_produto);
        const novoProcessamento = await processamentoService.buscarProcessamentoPorId(processamentoID);

        logger.info('Processamento adicionado com sucesso!');
        return res.status(201).json({message: 'Processamento adicionado com sucesso!', processamento: novoProcessamento});

    } catch(error){
        logger.error(`Erro ao adicionar processamento: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    };
});

router.delete('/del-process/:id', async(req, res) => {
    const processID = req.params.id;

    try { 

        const verificaID = await processamentoService.buscarProcessamentoPorId(processID);

        if(!verificaID) {
            logger.warn(`Processamento inexistente! Processamento: ${processID}`);
            return res.status(400).send('Processamento inexistente!');
        }
        const processDelete = await processamentoService.deletarProcessamento(processID);
        logger.info(`Processamento com id: ${processID} deletado com sucesso!`);
        res.status(204).send();

    } catch (error) {
        logger.error(`Erro ao deletar processamento: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
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
        const verificaID = await processamentoService.buscarProcessamentoPorId(processID);
        if(!verificaID) {
            logger.warn(`Processamento com id ${processID} inexistente!`);
            return res.status(404).send('Processamento inexistente!');
        }

        if(!process.comanda_id || !process.produto_id || !process.servico_id || !process.quantidade_servico || !process.quantidade_produto) {
            logger.warn('Erro ao atualizar processamento! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao atualizar processamento! Campos obrigatórios nulos!');
        }

        const processUpdate = await processamentoService.atualizarProcessamento(processID, process.comanda_id, process.produto_id, process.servico_id, process.quantidade_servico, process.quantidade_produto);
    
        logger.info(`Processamento com id ${processID} atualizado com sucesso!`);
        res.status(200).json({message: 'Processamento atualizado com sucesso!',
            processamento: processUpdate.data_update_processamento
        });
    
    } catch(error) {
        logger.error(`Erro ao atualizar processamento: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});


export default router;