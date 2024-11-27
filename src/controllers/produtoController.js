import express from "express";
import produtoService from "../services/produtoService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/produto/:id', async(req, res, next) => {
    const produtoID = req.params.id;

    try {
        const produto = await produtoService.buscarProdutoPorId(produtoID);

        logger.info(`Produto com id ${produtoID} encontrado: ${JSON.stringify(produto)}`);
        res.status(200).json({produto});
    } catch(error){
        next(error);
    }
});

router.get('/produtos', async(req, res, next) => {
    try {
        const produtos = await produtoService.buscarTodosProdutos();

        logger.info(`Produtos encontrados: ${JSON.stringify(produtos)}`);
        res.status(200).json({produtos});

    } catch(error){
        next(error);
    }
});

router.post('/add-produto', async(req, res, next) => {
    const produto = {
        codigo_produto: req.body.codigo_produto, 
        nome_produto: req.body.nome_produto, 
        valor_un_produto: req.body.valor_un_produto, 
        quantidade_estoque: req.body.quantidade_estoque
    };

    try {

        if(!produto.codigo_produto || !produto.nome_produto || produto.valor_un_produto === null || produto.valor_un_produto === undefined
            || produto.quantidade_estoque === null || produto.quantidade_estoque === undefined) {
                const error = new Error(`Erro ao adicionar produto! Campos obrigatórios nulos!`);
                error.status = 400;
                throw error;
            }

        const check = await produtoService.buscarTodosProdutos();

        const codigoExistente = check.some((codigo) => codigo.codigo_produto === produto.codigo_produto);
        if(codigoExistente) {
            const error = new Error(`Erro ao adicionar produto! O código ${produto.codigo_produto} já pertence a outro produto!`);
            error.status = 400;
            throw error;
        }

        // nessa consulta de produtoID o service esta retornando o insertId na promise quando resolvida
        const produtoID = await produtoService.adicionarProduto(produto.codigo_produto, produto.nome_produto, produto.valor_un_produto, produto.quantidade_estoque);
        const novoProduto = await produtoService.buscarProdutoPorId(produtoID);

        logger.info('Produto adicionado com sucesso!');
        res.status(201).json({message: 'Produto adicionado com sucesso!', produto: novoProduto});

    } catch (error) {
        next(error);
    };
});

router.delete('/delete-produto/:id', async(req, res, next) => {
    const produtoID = req.params.id;

    try {
        
        await produtoService.deletarProduto(produtoID);
        
        logger.info(`Produto com id: ${produtoID} deletado com sucesso!`);
        res.status(204).send();

    } catch (error){        
        next(error)
    }
});

router.put('/update-produto/:id', async(req, res, next) => {
    const produtoID = req.params.id;

    const produto = {    
        codigo_produto: req.body.codigo_produto, 
        nome_produto: req.body.nome_produto, 
        valor_un_produto: req.body.valor_un_produto, 
        quantidade_estoque: req.body.quantidade_estoque
    };
    
    try {
        const produtoUpdate = await produtoService.atualizarProduto(produtoID, produto.codigo_produto, produto.nome_produto, produto.valor_un_produto, produto.quantidade_estoque);

        logger.info(`Produto com id: ${produtoID} atualizado com sucesso!`);
        res.status(200).json({
            message: 'Produto atualizado com sucesso!', 
            produto: produtoUpdate
        });

    } catch(error) {
        next(error);
    }    
});

export default router;