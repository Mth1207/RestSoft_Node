import logger from "../../config/logger.js";

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;

    if (status === 400) {
        logger.warn(`Erro 400: ${err.message} - Rota: ${req.method} ${req.url}`);
    } else if (status === 404) {
        logger.warn(`Erro 404: ${err.message} - Rota: ${err.method} ${req.url}`);
    } else if (status === 401) {
        logger.warn(`Erro 401: ${err.message} - Rota: ${req.method} ${req.url}`);
    } else {
        logger.error(`Erro 500: ${err.message} - Rota: ${req.method} ${req.url}`);
    }

    res.status(status).send({
        mensagem: status === 500 ? 'Erro interno no servidor' : err.message,
        detalhes: status === 500 ? undefined : err.details || err.message,
    });
};

export default errorHandler;