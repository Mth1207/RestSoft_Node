import conexao from "../utils/conex/conex.js";
import getDataFormatada from "../config/dataFormatada.js";


/**
 * Busca um produto por ID
 * @param {number} id - Identificador do produto
 * @returns {Promise<object>} - Produto encontrado ou undefined
 */
const buscarProdutoPorId = (id) => {
    const selectIdSql = `
        SELECT * FROM tb_produto WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(selectIdSql, [id], (selectError, selectResults) => {
            if(selectError){
                const customError = new Error(`Erro ao buscar produto no banco de dados: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectIdSql, params: {id} };
                return reject(customError);
            }

            if(selectResults.length === 0){
                const notFoundError = new Error(`Produto com id ${id} não encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            resolve(selectResults[0]);
        });
    });
};

/**
 * Busca todos os produtos do banco de dados
 * @returns {Promise<Array<object>>} - Produtos encontrados
 */
const buscarTodosProdutos = () => {
    const selectSql = `
        SELECT * FROM tb_produto 
    `;

    return new Promise((resolve, reject) => {
        conexao.query(selectSql, (selectError, selectResults) => {
            if(selectError){
                const customError = new Error(`Erro ao buscar os produtos no banco de dados: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectSql};
                return reject(customError);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Nenhum produto encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            resolve(selectResults);
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
    const insertSql = `
        INSERT INTO tb_produto(codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, data_insert_produto) VALUES
        (?, ?, ?, ?, ?)
    `;

    const dataAtualizada = getDataFormatada();
    
    return new Promise((resolve, reject) => {
        conexao.query(insertSql, [codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataAtualizada], (insertError, insertResults) => {
            if(insertError){
                const customError = new Error(`Erro ao adicionar produto no banco de dados: ${insertError.message}`);
                customError.status = 500;
                customError.details = {insertSql, params: {codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataAtualizada}};
                return reject(customError);
            }

            resolve(insertResults.insertId);
        });
    });
};

/**
 * Deleta um produto pelo identificador
 * @param {number} id - Identificador do produto
 * @returns {Promise<string>} - Resultado da operação
 */
const deletarProduto = (id) => {
    const deleteSql = `
        DELETE FROM tb_produto WHERE id = ?
    `;

    const selectSql = `
        SELECT id FROM tb_produto WHERE id =? 
    `;

    return new Promise((resolve, reject) => {
        conexao.query(selectSql, [id], (selectError, selectResults) => {
            if(selectError){
                const customError = new Error(`Erro ao verificar produto: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectSql, params: {id} };
                return reject(customError);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Erro ao deletar! Produto não encontrado com id ${id}!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            conexao.query(deleteSql, [id], (deleteError, deleteResults) => {
                if(deleteError) {
                    const customError = new Error(`Erro ao deletar produto: ${error.message}`);
                    customError.status = 500;
                    customError.details = {sql, params: {id}};
                    return reject(customError);
                }

                resolve();
            });        
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
    const updateSql = `
        UPDATE tb_produto SET codigo_produto = ?, nome_produto = ?, valor_un_produto = ?, quantidade_estoque = ?, data_update_produto = ? WHERE id = ?
    `;

    const sqlSelect = `SELECT id FROM tb_produto WHERE id=? `;

    const dataAtualizada = getDataFormatada();

    return new Promise ((resolve, reject) => {

        conexao.query(sqlSelect, [id], (selectError, selectResults) => {
            if(selectError) {
                const error = new Error(`Erro ao verificar existência do produto: ${selectError.message}`);
                error.status = 500;
                return reject(error);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Produto com id ${id} não encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            conexao.query(updateSql, [codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataAtualizada, id], (updateError, updateResults) => {
                if(updateError) {
                    const customError = new Error(`Erro ao atualizar produto: ${updateError.message}`);
                    customError.status = 500;
                    customError.details = {updateSql, params: {id, codigo_produto, nome_produto, valor_un_produto, quantidade_estoque, dataAtualizada}};
                    return reject(customError);
                }
    
                if (updateResults.affectedRows === 0) {
                    const noChangeError = new Error(`Nenhuma alteração foi feita nos dados do produto: ${id}`);
                    noChangeError.status = 400;
                    return reject(noChangeError);
                }
    
                resolve({
                    codigo_produto: codigo_produto,
                    nome_produto: nome_produto,
                    valor_un_produto: valor_un_produto,
                    quantidade_estoque: quantidade_estoque,
                    data_update_produto: dataAtualizada
                });
            });
        });
    });
};


export default {buscarProdutoPorId, buscarTodosProdutos, adicionarProduto, deletarProduto, atualizarProduto};