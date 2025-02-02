import { executeQuery } from './src/lib/db.js';

const testConnection = async () => {
  try {
    const result = await executeQuery<{ result: number }>({
      query: 'SELECT 1 as result'
    });
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    console.log('Resultado:', result);
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
  }
};

testConnection(); 