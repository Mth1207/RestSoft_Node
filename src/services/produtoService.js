import conexao from "../utils/conex/conex.js";
import dataFormatada from "../config/dataFormatada.js";


/**
 * Busca um produto por ID
 * @param {number} id - Identificador do produto
 * @returns {Promise<object>} - Produto encontrado ou undefined
 */
const buscarProdutoPorId = (id) => {
    const sql = `
        SELECT * FROM tb_produto WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (error, results) => {
            if(error){
                reject(error);
            }
            resolve(results[0]);
        });
    });
};


/**
 * Busca todos os produtos do banco de dados
 * @returns {Promise<Array<object>>} - Produtos encontrados
 */
const buscarTodosProdutos = () => {
    const sql = `
        SELECT * FROM tb_produto 
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, (error, results) => {
            if(error){
                return reject(`Nao foi possivel buscar os produtos: ${error.message}`);
            }

            resolve(results);
        });
    });
};


/**
 * Adiciona um produto ao banco de dados
 * @param {string} codigo_produto - Codigo do produto
 * @param {string} nome_produto - Nome do produto
 * @param {number} valor_un_produto - Valor unitario do produto
 * @param {number} quantidade_estoque - Quantidade do produto no estoque
 * @returns {Promise<number>} - Identificador do produto adicionado
 */
const adicionarProduto = (codigo_produto, nome_produto, valor_un_produto, quantidade_estoque) => {
    const sql = `
        INSERT INTO tb_produto(codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, data_insert_produto) VALUES
        (?, ?, ?, ?, ?)
    `;
    
    return new Promise((resolve, reject) => {
        conexao.query(sql, [codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataFormatada], (error, results) => {
            if(error){
                reject('Nao foi possivel adicionar o produto!');
            }
            resolve(results.insertId);
        });
    });
};


/**
 * Deleta um produto pelo identificador
 * @param {number} id - Identificador do produto
 * @returns {Promise<string>} - Resultado da operação
 */
const deletarProduto = (id) => {
    const sql = `
        DELETE FROM tb_produto WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (error, results) => {
            if(error) {
                reject('Não foi possível deletar a comanda!');
            }
            resolve('resultado: ', results);
        });
    });
};


/**
 * Atualiza um produto
 * @param {string} codigo_produto - Codigo do produto
 * @param {string} nome_produto - Nome do produto
 * @param {number} valor_un_produto - Valor unitario do produto
 * @param {number} quantidade_estoque - Quantidade do produto no estoque
 * @returns {Promise<string>} - Resultado da operação
 */
const atualizarProduto = (id,codigo_produto, nome_produto, valor_un_produto, quantidade_estoque) => {
    const sql = `
        UPDATE tb_produto SET codigo_produto = ?, nome_produto = ?, valor_un_produto = ?, quantidade_estoque = ?, data_update_produto = ? WHERE id = ?
    `;

    return new Promise ((resolve, reject) => {
        conexao.query(sql, [codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataFormatada, id], (error, results) => {
            if(error) {
                reject('Nao foi possivel atualizar o produto!');
            }
            resolve(results);
        });l
    });
};


export default {buscarProdutoPorId, buscarTodosProdutos, adicionarProduto, deletarProduto, atualizarProduto};