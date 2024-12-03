import conexao from "../utils/conex/conex.js";
import getDataFormatada from "../config/dataFormatada.js";

/**
 * Busca um processamento por ID
 * @param {number} id - Identificador do processamento
 * @returns {Promise<object>} - Processamento encontrado ou undefined
 */
const buscarProcessamentoPorId = (id) => {
    const selectIdSql = `
        SELECT * FROM tb_processamento WHERE id = ?
    `;

    return new Promise((resolve, reject) => {    
        conexao.query(selectIdSql, [id], (selectError, selectResults) => {
            if(selectError){
                const customError = new Error(`Erro ao buscar processamento no banco de dados: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectIdSql, params: {id}};
                return reject(customError);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Processamento com id ${id} nao encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            resolve(selectResults[0]);
        });
    });
};  

/**
 * Busca todos os processamentos do banco de dados
 * @returns {Promise<Array<object>>} - Processamentos encontrados
 */
const buscarTodosProcessamentos = () => {
    const selectSql = `
        SELECT * FROM tb_processamento
    `;

    return new Promise((resolve, reject) => {
        conexao.query(selectSql, (selectError, selectResults) => {
            if(selectError) {
                const customError = new Error(`Erro ao buscar processamento no banco de dados: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectSql};
                return reject(customError);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Nenhum processamento encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }
            resolve(selectResults);
        });
    });
};

/**
 * Cria um processamento
 * @param {number} comanda_id - Identificador da comanda
 * @param {number} produto_id - Identificador do produto
 * @param {number} servico_id - Identificador do servico
 * @param {number} quantidade_servico - Quantidade do servico
 * @param {number} quantidade_produto - Quantidade do produto
 * @returns {Promise<number>} - Identificador do processamento criado
 */
const criarProcessamento = (comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto) => {
    const insertSql = `
        INSERT INTO tb_processamento(comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, data_abertura_processamento) VALUES
        (?, ?, ?, ?, ?, ?)
    `;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        conexao.query(insertSql,[comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada], (insertError, insertResults) => {
            if(insertError) {
                const customError = new Error(`Erro ao criar processamento no banco de dados: ${insertError.message}`);
                customError.status = 500;
                customError.details = {insertSql, params: {comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada}};
                return reject(customError);
            }
            resolve(insertResults.insertId);
        });
    });
};

/**
 * Deleta um processamento pelo identificador
 * @param {number} id - Identificador do processamento
 * @returns {Promise<string>} - Resultado da operação
 */
const deletarProcessamento = (id) => {
    const deleteSql = `
        DELETE FROM tb_processamento WHERE id = ?
    `;

    const selectSql = `
        SELECT id FROM tb_processamento WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(selectSql, [id], (selectError, selectResults) => {
            if(selectError) {
                const customError = new Error(`Erro ao verificar processamento: ${selectError.message}`);
                customError.status = 500;
                customError.details = {selectSql, params: {id}};
                return reject(customError);
            }

            if(selectResults.length === 0) {    
                const notFoundError = new Error(`Erro ao deletar! Processamento não encontrado com id ${id}!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }
            
            conexao.query(deleteSql, [id], (deleteError, deleteResults) => {
                if(deleteError) {
                    const customError = new Error(`Erro ao deletar processamento: ${deleteError.message}`);
                    customError.status = 500;
                    customError.details = {deleteSql, params: {id}};
                    return reject(customError);
                }

                if(deleteResults.affectedRows === 0) {
                    const notFoundError = new Error(`Verifique se o processamento com id ${id} existe.`);
                    notFoundError.status = 404;
                    return reject(notFoundError);
                }

                resolve();
            });
        });
    });
};


/**
 * Atualiza um processamento
 * @param {number} id - Identificador do processamento
 * @param {number} comanda_id - Identificador da comanda
 * @param {number} produto_id - Identificador do produto
 * @param {number} servico_id - Identificador do servico
 * @param {number} quantidade_servico - Quantidade do servico
 * @param {number} quantidade_produto - Quantidade do produto
 * @returns {Promise<void>} - Resultado da operação
 */
const atualizarProcessamento = (id, comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto) => {
    const updateSql = `
        UPDATE tb_processamento SET
        comanda_id = ?,
        produto_id = ?,
        servico_id = ?,
        quantidade_servico = ?,
        quantidade_produto = ?,
        data_update_processamento = ?
        WHERE id = ?
    `;

    const selectSql = `
        SELECT id FROM tb_processamento WHERE id = ?
    `;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        conexao.query(selectSql, [id], (selectError, selectResults) => {
            if (selectError) {
                const error = new Error(`Erro ao verificar existência do processamento: ${selectError.message}`);
                error.status = 500;
                return reject(error);
            }

            if(selectResults.length === 0 ) {
                const notFoundError = new Error(`Processamento com id ${id} não encontrado!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }
            conexao.query(updateSql, [comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada, id], (updateError, updateResults) => {
                if (updateError) {
                    const customError = new Error(`Erro ao atualizar processamento: ${updateError.message}`);
                    customError.status = 500;
                    customError.details = {updateSql, params: {id, comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada}};
                    return reject(customError);
                }
    
                if (updateResults.affectedRows === 0) {
                    const noChangeError = new Error(`Nenhuma alteração foi feita nos dados do processamento: ${id}`);
                    noChangeError.status = 400;
                    return reject(noChangeError);
                }
    
                resolve({
                    comanda_id : comanda_id,
                    produto_id : produto_id,
                    servico_id : servico_id,
                    quantidade_servico : quantidade_servico,
                    quantidade_produto : quantidade_produto,
                    data_update_processamento: dataAtualizada
                });
            });
        });
    });
};


export default {criarProcessamento, buscarTodosProcessamentos, buscarProcessamentoPorId, deletarProcessamento, atualizarProcessamento};