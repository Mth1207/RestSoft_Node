import conexao from './utils/conex/conex.js';

// conexao.query("SELECT * FROM comanda", (error, results) => {
//     if(error) {
//         console.error('Erro ao executar a consulta: ', error);
//         return;
//     }
//     console.log('Resultados: ', results);
// });

// conexao.end();

////////////////////////////////////////////////////

// conexao.execute(
//     'SELECT * FROM produto where id=?', [2], (error, results) => {
//         if (error) {
//             throw error;  
//         } 

//         if (results.length === 0) {
//             console.log("Nenhum item encontrado!")
//         } else {
//             console.log(results);
//         }
//     }
// );

////////////////////////////////////////////////////

// const sql = `
//     INSERT INTO itens_comanda(
//     comanda_id,
//     produto_id,
//     valor_livre,
//     valor_kg,
//     tipo_almoco,
//     peso_almoco,
//     quantidade_almoco,
//     quantidade_itens,
//     data_abertura_comanda
//     )
//     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)
// `;

// const values = [1, 2, 10, 10, 'LIVRE', 0, 1, 1, new Date()];

// conexao.query(sql, values, (error, results) => {
//     if(error){
//         throw error;
//     }

//     console.log('Dados inseridos com sucesso!');
// });

/////////////////////////////////////////////////////

// async function obterResultado() {
//     const sql = `
//         SELECT p.nome, p.valor_unitario, p.quantidade_estoque FROM itens_comanda ic
//         JOIN produto p ON ic.produto_id = p.id
//     `;
    
//     return new Promise((resolve, reject) => {
//         conexao.query(sql, (error, results) => {
//             if(error) {
//                 return reject(error);
//             }
//             resolve(results);
//         });
//     });
// }

// (async () => {
//     try {
//         const resultado = await obterResultado();
//         console.log('Resultado: ', resultado);
//         let teste = resultado;
//         let total = resultado[0].valor_unitario * resultado[0].quantidade_estoque;
//         console.log('Nome:', teste[0].nome.toUpperCase());
//         console.log('Valor unitário:', teste[0].valor_unitario);
//         console.log('Quantidade Estoque:', teste[0].quantidade_estoque);
//         console.log('Valor total estoque: ', total);
//     } catch(error){
//         console.error('Erro: ', error);
//     } finally {
//         conexao.end();
//     }
// })();

//////////////////////////////////////////////////

// TB_COMANDA ↓

// const sql = `
//     INSERT INTO tb_comanda 
//     (codigo_comanda, valor_total) VALUES 
//     (?, ?)
// `;

// conexao.query(sql, ['01', 0], (error, results) => {
//     if(error){
//         throw error;
//     }

//     console.log('Dados inseridos com sucesso!');
// });


// conexao.query('SELECT * FROM tb_comanda', (error, results) => {
//     if (error){
//         throw error;
//     }

//     console.log('TB COMANDA\n', results);
// });

///////////////////////////////////////////////////

// TB_PRODUTO

// const sql = `
//     INSERT INTO tb_produto 
//     (codigo_produto, nome_produto, valor_un_produto, quantidade_estoque) VALUES
//     (?, ?, ?, ?)
// `;

// conexao.query(sql, ['01', 'Coca-Cola 600ml', 3.50, 10], (error, results) => {
//     if(error){
//         throw error;
//     }

//     console.log('Dados para PRODUTO inseridos com sucesso!');
// });

// conexao.query('SELECT * FROM tb_produto', (error, results) => {
//     if(error){
//         throw error;
//     }

//     console.log('TB PRODUTOS\n', results);
// });

////////////////////////////////////////////////

// TB_SERVICO
// const sql = `
//     INSERT INTO tb_servico 
//     (id,tipo_servico, valor_livre, valor_kg, data_insert) VALUES
//     (?, ?, ?, ?, ?)
// `;

// conexao.query(sql, [1, 'KG', 100, 65.00, new Date()], (error, results) => {
//     if(error) {
//         throw error;
//     }

//     console.log('TB SERVICO', results);
// });

// conexao.query('SELECT * FROM tb_servico', (error, results) => {
//     if(error){
//         throw error;
//     }

//     console.log('TB SERVICOS\n', results);
// });

/////////////////////////////////////////////

// TB_PROCESSAMENTO

// const sql = `
//     INSERT INTO tb_processamento
//     (comanda_id, produto_id, servico_id, quantidade_servico, quantidade_produto, data_abertura_processamento) VALUES
//     (?, ?, ?, ?, ?, ?)
// `;

// conexao.query(sql, [1, 2, 2, 1, 1, new Date()], (error, results) => {
//     if(error) {
//         throw error;
//     }

//     conexao.query('SELECT * FROM tb_processamento', (error, results) => {
//         if(error){
//             throw error;
//         }
//         console.log('TB PROCESSAMENTO\n', results);
//     });
// });

////////////////////////////////////////////

// JOIN na TB PROCESSAMENTO

// const sql = `
//     select c.codigo_comanda, p.nome_produto , s.tipo_servico, tp.quantidade_servico, tp.quantidade_produto, tp.data_abertura_processamento 
//     from tb_processamento tp
//     join tb_produto p on p.id = tp.produto_id
//     join tb_servico s on s.id = tp.servico_id
//     join tb_comanda c on c.id = tp.comanda_id;
// `;

// conexao.query(sql, (error, results) => {
//     if(error) {
//         throw error;
//     }

//     console.log(results)
// });

////////////////////////////////////////////

conexao.query('SELECT * FROM tb_comanda', (error, results) => {
    if(error){
        throw error;
    }

    console.log('TB COMANDA\n', results);
});