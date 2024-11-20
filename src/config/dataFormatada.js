// import comandaProdutoService from "../service/comandaProdutoService.js";


// /**
//  * Pega a data de abertura da primeira comanda encontrada na base de dados
//  * @returns {Promise<Date>}
//  */
// async function pegarDataBd() {
//     const data = await comandaProdutoService.buscarTodasComandas();
//     return data[0].data_abertura_comanda;
// }



// /**
//  * Exibe a data de abertura da primeira comanda encontrada na base de dados
//  * em formato ISO no console
//  */
// async function exibirDataBd() {
//     const data = await pegarDataBd();
//     console.log(data);
// }

// exibirDataBd();

/**
 * Retorna a data atual no formato ISO
 * @returns {string} - Data atual em formato ISO
 */
const getDataFormatada = () => {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const hora = String(data.getHours()).padStart(2, '0');
    const minuto = String(data.getMinutes()).padStart(2, '0');
    const segundo = String(data.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`;
};

export default getDataFormatada;

