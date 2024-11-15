import conexao from "../utils/conex/conex.js";
import dataFormatada from "../config/dataFormatada.js";

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
            if(error) {
                reject(error);
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
                return reject(`Não foi possível buscar as comandas: ${error.message}`);
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

    return new Promise((resolve, reject) => {
        conexao.query(sql, [codigoComanda, valorTotal, dataFormatada, 'ABERTA'], (error, results) => {
            if(error){
                reject('Não foi possível criar a comanda!');
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
                reject('Não foi possível deletar a comanda!');
            }
            resolve('resultado: ', results);
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
        UPDATE tb_comanda SET codigo_comanda = ?, valor_total = ?, data_atualizacao_comanda = ? WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [codigoComanda, valorTotal, dataFormatada, id], (error, results) => {
            if(error){
                reject('Não foi possível atualizar a comanda!');
            }
            resolve('resultado: ', results);            
        });
    });
};


export default {buscarComandaPorId, criarComanda, buscarTodasComandas, deletarComanda, atualizarComanda};