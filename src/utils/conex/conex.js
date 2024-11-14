import { createConnection } from 'mysql2';

const conexao = createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'restNode'
});

conexao.connect((error) => {
    if(error){
        console.error('Erro ao conectar ao Mysql:', error);
        return;
    }
    console.log('Conexão com Mysql estabelecida com sucesso!');
});

export default conexao;