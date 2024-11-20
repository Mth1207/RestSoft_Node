import express from "express";
import produtoService from "../services/produtoService.js";
import logger from "../config/logger.js";

const router = express.Router();

router.get('/produto/:id', async(req, res) => {
    const produtoID = req.params.id;

    try {
        const produto = await produtoService.buscarProdutoPorId(produtoID);

        if(!produto) {
            logger.warn(`Produto com o id ${produtoID} não encontrado!`);
            return res.status(404).send(`Produto com id ${produtoID} não encontrado!`);
        }

        logger.info(`Produto com id ${produtoID} encontrado: ${JSON.stringify(produto)}`);
        res.status(200).json({message: 'Produto encontrado!', produto});
    } catch(error){
        logger.error(`Erro ao buscar produto: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

router.get('/produtos', async(req, res) => {
    try {
        const produtos = await produtoService.buscarTodosProdutos();

        if(produtos.length === 0) {
            logger.warn('Nenhum produto encontrado!');
            return res.status(404).send('Nenhum produto encontrado!');
        }

        logger.info(`Produtos encontrados: ${JSON.stringify(produtos)}`);
        res.status(200).json({message: 'Produtos: ', produtos});

    } catch(error){
        logger.error(`Erro ao buscar produto: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

router.post('/add-produto', async(req, res) => {
    const produto = {
        codigo_produto: req.body.codigo_produto, 
        nome_produto: req.body.nome_produto, 
        valor_un_produto: req.body.valor_un_produto, 
        quantidade_estoque: req.body.quantidade_estoque
    };

    try {
        const check = await produtoService.buscarTodosProdutos();

        console.log(check);
        for (let i = 0; i < check.length; i++) {
            if(check[i].codigo_produto === produto.codigo_produto) {
                logger.warn(`Erro ao adicionar produto! O código ${produto.codigo_produto} ja pertence a outro produto!`);
                return res.status(400).send(`Erro ao adicionar produto! O código ${produto.codigo_produto} ja pertence a outro produto!`);
            }
            else if(check[i].nome_produto === produto.nome_produto) {
                logger.warn(`Erro ao adicionar produto! O nome ${produto.nome_produto} já foi adicionado!`);
                return res.status(400).send(`Erro ao adicionar produto! O nome ${produto.nome_produto} já foi adicionado!`);
            }
        };

        if(!produto.codigo_produto || !produto.nome_produto || !produto.valor_un_produto || !produto.quantidade_estoque) {
            logger.warn('Erro ao adicionar produto! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao adicionar produto! Campos obrigatórios nulos!');
        };

        // nessa consulta de produtoID o service esta retornando o insertId na promise quando resolvida
        const produtoID = await produtoService.adicionarProduto(produto.codigo_produto, produto.nome_produto, produto.valor_un_produto, produto.quantidade_estoque);
        const novoProduto = await produtoService.buscarProdutoPorId(produtoID);

        logger.info('Produto adicionado com sucesso!');
        res.status(201).json({message: 'Produto adicionado com sucesso!', produto: novoProduto});

    } catch (error) {
        logger.error(`Erro ao adicionar produto: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    };
});

router.delete('/delete-produto/:id', async(req, res) => {
    const produtoID = req.params.id;

    try {
        const verificaID = await produtoService.buscarProdutoPorId(produtoID);

        if(!verificaID) {
            logger.warn(`Produto inexistente! Produto: ${produtoID}`);
            return res.status(404).send('Produto inexistente!');
        }
        const produtoDelete = await produtoService.deletarProduto(produtoID);
        
        logger.info(`Produto com id: ${produtoID} deletado com sucesso!`);
        res.status(204).send();

    } catch (error){        
        logger.error(`Erro ao deletar produto: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }
});

router.put('/update-produto/:id', async(req, res) => {
    const produtoID = req.params.id;

    const produto = {    
        codigo_produto: req.body.codigo_produto, 
        nome_produto: req.body.nome_produto, 
        valor_un_produto: req.body.valor_un_produto, 
        quantidade_estoque: req.body.quantidade_estoque
    };
    
    try {
        const verificaID = await produtoService.buscarProdutoPorId(produtoID);
        if(!verificaID) {
            logger.warn(`Produto com id ${produtoID} inexistente!`);
            return res.status(404).send('Produto inexistente!');
        }

        if(!produto.codigo_produto || !produto.nome_produto || !produto.valor_un_produto || !produto.quantidade_estoque) {
            logger.warn('Erro ao atualizar produto! Campos obrigatórios nulos!');
            return res.status(400).send('Erro ao atualizar produto! Campos obrigatórios nulos!');        
        }

        const produtoUpdate = await produtoService.atualizarProduto(produtoID, produto.codigo_produto, produto.nome_produto, produto.valor_un_produto, produto.quantidade_estoque);

        logger.info(`Produto com id: ${produtoID} atualizado com sucesso!`);
        res.status(200).json({message: 'Produto atualizado com sucesso!', 
            produto: produtoUpdate.data_update_produto
        });

    } catch(error) {
        logger.error(`Erro ao atualizar produto: ${error.stack || error.message || error}`);
        res.status(500).json({
            error: 'Erro interno no servidor!',
            detalhes: error.message || error
        });
    }    
});

export default router;