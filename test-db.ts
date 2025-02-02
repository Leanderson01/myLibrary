import { executeQuery } from './src/lib/db.js';

const testConnection = async () => {
  try {
    // Teste de conexão básico
    await executeQuery<{ result: number }>({
      query: 'SELECT 1 as result'
    });
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!\n');

    // Listar todas as tabelas
    const tabelas = await executeQuery<Array<{ Tables_in_biblioteca_hipotetica: string }>>({
      query: 'SHOW TABLES'
    });
    console.log('📋 Tabelas do banco:');
    console.table(tabelas);

    // Mostrar estrutura de cada tabela
    for (const tabela of tabelas) {
      const nomeTabela = tabela.Tables_in_biblioteca_hipotetica;
      console.log(`\n📊 Estrutura da tabela ${nomeTabela}:`);
      
      const estrutura = await executeQuery<Array<{
        Field: string;
        Type: string;
        Null: string;
        Key: string;
        Default: string | null;
        Extra: string;
      }>>({
        query: `DESCRIBE ${nomeTabela}`
      });
      console.table(estrutura);

      // Mostrar alguns dados de exemplo
      console.log(`\n📝 Primeiros registros da tabela ${nomeTabela}:`);
      const dados = await executeQuery({
        query: `SELECT * FROM ${nomeTabela} LIMIT 3`
      });
      console.table(dados);
      console.log('─'.repeat(100)); // Linha separadora
    }

  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error);
    if (error instanceof Error) {
      console.error('Mensagem de erro:', error.message);
    }
  }
};

testConnection(); 