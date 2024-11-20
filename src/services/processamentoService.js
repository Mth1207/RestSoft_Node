import conexao from "../utils/conex/conex.js";
import getDataFormatada from "../config/dataFormatada.js";

/**
 * Busca um processamento por ID
 * @param {number} id - Identificador do processamento
 * @returns {Promise<object>} - Processamento encontrado ou undefined
 */
const buscarProcessamentoPorId = (id) => {
    const sql = `
        SELECT * FROM tb_processamento WHERE id = ?
    `;

    return new Promise((resolve, reject) => {    
        conexao.query(sql, [id], (error, results) => {
            if(error) {
                console.error('Erro na query SQL:', sql);
                console.error('Parâmetros:', { id });
                return reject(`Erro ao executar query: ${error.message}`);
            }
            resolve(results[0]);
        });
    });
};  

/**
 * Busca todos os processamentos do banco de dados
 * @returns {Promise<Array<object>>} - Processamentos encontrados
 */
const buscarTodosProcessamentos = () => {
    const sql = `
        SELECT * FROM tb_processamento
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, (error, results) => {
            if(error) {
                console.error('Erro na query SQL:', sql);
                console.error('Parâmetros:', {});
                return reject(`Erro ao executar query: ${error.message}`);
            }
            resolve(results);
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
    const sql = `
        INSERT INTO tb_processamento(comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, data_abertura_processamento) VALUES
        (?, ?, ?, ?, ?, ?)
    `;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        conexao.query(sql,[comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada], (error, results) => {
            if(error) {
                console.error('Erro na query SQL:', sql);
                console.error('Parâmetros:', { comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada });
                return reject(`Erro ao executar query: ${error.message}`);
            }
            resolve(results.insertId);
        });
    });
};

/**
 * Deleta um processamento pelo identificador
 * @param {number} id - Identificador do processamento
 * @returns {Promise<string>} - Resultado da operação
 */
const deletarProcessamento = (id) => {
    const sql = `
        DELETE FROM tb_processamento WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (error, results) => {
            if(error) {
                console.error('Erro na query SQL:', sql);
                console.error('Parâmetros:', { id });
                return reject(`Erro ao executar query: ${error.message}`);
            }
            resolve('resultado: ', results);
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
    const sql = `
        UPDATE tb_processamento SET
        comanda_id = ?,
        produto_id = ?,
        servico_id = ?,
        quantidade_servico = ?,
        quantidade_produto = ?,
        data_update_processamento = ?
        WHERE id = ?
    `;

    const dataAtualizada = getDataFormatada();

    return new Promise((resolve, reject) => {
        conexao.query(sql, [comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada, id], (error, results) => {
            if (error) {
                console.error('Erro na query SQL:', sql);
                console.error('Parâmetros:', { id, comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, dataAtualizada });
                return reject(`Erro ao executar query: ${error.message}`);
            }

            if (results.affectedRows === 0) {
                return reject('Nenhuma linha foi afetada. Verifique os parâmetros ou o ID.');
            }

            resolve({
                affectedRows: results.affectedRows,
                data_update_processamento: dataAtualizada
            });
        });
    });
};


export default {criarProcessamento, buscarTodosProcessamentos, buscarProcessamentoPorId, deletarProcessamento, atualizarProcessamento};