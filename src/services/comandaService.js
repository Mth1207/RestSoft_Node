import conexao from "../utils/conex/conex.js";
import getDataFormatada from "../config/dataFormatada.js";


/**
 * Busca uma comanda por ID
 * @param {number} id - Identificador numero da comanda
 * @returns {Promise<object>} - Comanda encontrada ou undefined
 */
const buscarComandaPorId = (id) => {
    const sql = `
        SELECT * FROM tb_comanda WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (error, results) => {
            if (error) {
                const customError = new Error(`Erro ao buscar a comanda no banco de dados: ${error.message}`);
                customError.status = 500;
                customError.details = { sql, params: {id} };
                return reject(customError);
            }
  
            if (results.length === 0) {
                const notFoundError = new Error(`Comanda com id ${id} não encontrada!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            resolve(results[0]);
        });
    });
};

/**
 * Busca todas as comandas do banco de dados
 * @returns {Promise<Array<object>>} - Comandas encontradas
 */
const buscarTodasComandas = () => {
    const sql = `
        SELECT * FROM tb_comanda
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, (error, results) => {            
            if(error){
                const customError = new Error(`Erro ao buscar as comandas no banco de dados: ${error.message}`);
                customError.status = 500;
                customError.details = {sql};
                return reject(customError);
            }

            if(results.length === 0) {
                const notFoundError = new Error('Nenhuma comanda encontrada!');
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            resolve(results);
        });
    });
};

/**
 * Cria uma comanda com um código e valor total
 * @param {string} codigoComanda - Código da comanda
 * @param {number} valorTotal - Valor total da comanda
 * @returns {Promise<number>} - Identificador da comanda criada
 */
const criarComanda = (codigoComanda, valorTotal) => {
    const sql = `
        INSERT INTO tb_comanda(codigo_comanda, valor_total, data_abertura_comanda, status) VALUES
        (?, ?, ?, ?)
    `;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        conexao.query(sql, [codigoComanda, valorTotal, dataAtualizada, 'ABERTA'], (error, results) => {
            if(error){
                const customError = new Error(`Erro ao criar comanda no banco de dados: ${error.message}`);
                customError.status = 500;
                customError.details = {sql, params:{codigoComanda, valorTotal, dataAtualizada}};
                return reject(customError);
            }
            resolve(results.insertId);
        });
    });
};

/**
 * Deleta uma comanda pelo identificador
 * @param {number} id - Identificador da comanda
 * @returns {Promise<string>} - Resultado da operação
 */
const deletarComanda = (id) => {
    const sql = `
        DELETE FROM tb_comanda WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (error, results) => {
            if(error){
                const customError = new Error(`Erro ao deletar comanda: ${error.message}`);
                customError.status = 500;
                customError.details = {sql, params: {id}};
                return reject(customError);
            }
            if(results.affectedRows === 0) {
                const notFoundError = new Error(`Comanda com id ${id} não encontrada!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }
            resolve();
        });
    });
};

/**
 * Atualiza uma comanda
 * @param {number} id - Identificador da comanda
 * @param {string} codigoComanda - Novo código da comanda
 * @param {number} valorTotal - Novo valor total da comanda
 * @returns {Promise<string>} - Resultado da operação
 */
const atualizarComanda = (id, codigoComanda, valorTotal) => {
    const sql = `
        UPDATE tb_comanda SET codigo_comanda = ?, valor_total = ?, data_update_comanda = ? WHERE id = ?
    `;

    const sqlSelect = `SELECT id FROM tb_comanda WHERE id = ?`;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        
        conexao.query(sqlSelect, [id], (selectError, selectResults) => {
            if(selectError){
                const error = new Error(`Erro ao verificar existência da comanda: ${selectError.message}`);
                error.status = 500;
                return reject(error);
            }

            if(selectResults.length === 0) {
                const notFoundError = new Error(`Comanda com id ${id} não encontrada!`);
                notFoundError.status = 404;
                return reject(notFoundError);
            }

            conexao.query(sql, [codigoComanda, valorTotal, dataAtualizada, id], (error, results) => {
                if(error){
                    const customError = new Error(`Erro ao atualizar comanda: ${error.message}`);
                    customError.status = 500;
                    customError.details = {sql, params: {id, codigoComanda, valorTotal, dataAtualizada}};
                    return reject(customError);
                }
    
                if (results.affectedRows === 0) {
                    const noChangeError = new Error(`Nenhuma alteração foi feita nos dados da comanda: ${id}`);
                    noChangeError.status = 400;
                    return reject(noChangeError);
                }

                resolve({
                    affectedRows: results.affectedRows,
                    codigo_comanda: codigoComanda,
                    valor_total: valorTotal,
                    data_update_comanda: dataAtualizada
                });
            });
        });
    });
};

export default {buscarComandaPorId, criarComanda, buscarTodasComandas, deletarComanda, atualizarComanda};