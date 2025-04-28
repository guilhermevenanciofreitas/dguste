import sql from 'mssql';
import bcrypt from 'bcryptjs';

// Defina o nome de usuário e a senha para validação
const username = 'guilherme.venancio'; // Substitua pelo nome de usuário real
const password = '@Rped94ft'; // Substitua pela senha real

// Configuração do banco de dados SQL Server
const config = {
  user: 'Sa',
  password: 'Tcldatabase@01',
  server: '192.168.1.103',
  database: 'Dev',
  options: {
    encrypt: false, // Use "true" se você estiver usando SSL, caso contrário use "false"
    trustServerCertificate: true, // Define como "true" para evitar problemas de certificado
  },
};

async function validateUser(username, password) {
  try {
    // Conectando ao banco de dados
    await sql.connect(config);

    // Consulta para buscar o usuário no banco
    //const result = await sql.query`SELECT PasswordHash FROM aspnet_Users WHERE Username = ${username}`;

    //if (result.recordset.length === 0) {
    //  console.log('Usuário não encontrado.');
    //  return false;
    //}

    // Recupera o hash da senha do banco
    const hashedPassword = 'mdfhA5vrwFNIIsUzVnNgv75z9Yc=';

    // Valida a senha usando bcrypt
    const isValidUser = bcrypt.compareSync(password, hashedPassword);

    if (isValidUser) {
      console.log('Usuário validado com sucesso.');
    } else {
      console.log('Falha na validação do usuário.');
    }

    // Fecha a conexão
    await sql.close();
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
}

// Chama a função de validação
validateUser(username, password);
