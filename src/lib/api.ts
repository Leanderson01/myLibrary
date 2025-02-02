import { executeQuery } from './db.js';

// Interfaces
interface Livro {
  livro_id: number;
  titulo: string;
  ano_publicacao: number;
  editora: string;
  categoria_id: number;
}

interface Categoria {
  categoria_id: number;
  nome: string;
}

interface Autor {
  autor_id: number;
  nome: string;
  nacionalidade: string;
}

interface Usuario {
  usuario_id: number;
  nome: string;
  email_principal: string;
  email_secundario?: string;
  telefone_principal: string;
  telefone_secundario?: string;
  senha: string;
}

interface Reserva {
  reserva_id: number;
  usuario_id: number;
  livro_id: number;
  data_reserva: Date;
  data_devolucao: Date;
}

// Funções de API
export const api = {
  // Autenticação
  async login(email: string, senha: string) {
    const query = 'SELECT * FROM usuarios WHERE email_principal = ? AND senha = ?';
    return executeQuery<Usuario[]>({ query, values: [email, senha] });
  },

  async cadastrarUsuario(usuario: Omit<Usuario, 'usuario_id'>) {
    const query = `
      INSERT INTO usuarios 
      (nome, email_principal, email_secundario, telefone_principal, telefone_secundario, senha)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return executeQuery({ 
      query, 
      values: [
        usuario.nome,
        usuario.email_principal,
        usuario.email_secundario || null,
        usuario.telefone_principal,
        usuario.telefone_secundario || null,
        usuario.senha
      ]
    });
  },

  // Livros
  async getLivros() {
    return executeQuery<Livro[]>({ query: 'SELECT * FROM livros' });
  },

  async getLivroPorId(id: number) {
    const query = 'SELECT * FROM livros WHERE livro_id = ?';
    return executeQuery<Livro[]>({ query, values: [id] });
  },

  // Categorias
  async getCategorias() {
    return executeQuery<Categoria[]>({ query: 'SELECT * FROM categorias' });
  },

  async getLivrosPorCategoria(categoriaId: number) {
    const query = 'SELECT * FROM livros WHERE categoria_id = ?';
    return executeQuery<Livro[]>({ query, values: [categoriaId] });
  },

  // Autores
  async getAutores() {
    return executeQuery<Autor[]>({ query: 'SELECT * FROM autores' });
  },

  async getLivrosPorAutor(autorId: number) {
    const query = `
      SELECT l.* 
      FROM livros l
      JOIN livros_autores la ON l.livro_id = la.livro_id
      WHERE la.autor_id = ?
    `;
    return executeQuery<Livro[]>({ query, values: [autorId] });
  },

  // Reservas
  async getReservasUsuario(usuarioId: number) {
    const query = `
      SELECT r.*, l.titulo
      FROM reservas r
      JOIN livros l ON r.livro_id = l.livro_id
      WHERE r.usuario_id = ?
    `;
    return executeQuery<(Reserva & { titulo: string })[]>({ query, values: [usuarioId] });
  },

  async criarReserva(usuarioId: number, livroId: number) {
    const query = `
      INSERT INTO reservas (usuario_id, livro_id, data_reserva, data_devolucao)
      VALUES (?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY))
    `;
    return executeQuery({ query, values: [usuarioId, livroId] });
  },

  async cancelarReserva(reservaId: number) {
    const query = 'DELETE FROM reservas WHERE reserva_id = ?';
    return executeQuery({ query, values: [reservaId] });
  }
}; 