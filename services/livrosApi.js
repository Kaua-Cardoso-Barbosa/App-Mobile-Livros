import { getToken } from "./usuario/usuarioStorage";

const API_URL = "https://apps-api-livros.ucxocw.easypanel.host";

async function request(path, opcoes = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opcoes.headers || {}),
  };

  if (opcoes.autenticado) {
    const token = await getToken();

    if (!token) {
      throw new Error("Voce precisa estar logado para fazer essa acao.");
    }

    headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_URL}${path}`, {
    method: opcoes.method || "GET",
    headers,
    body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
  });

  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : {};

  if (!resposta.ok) {
    throw new Error(dados.mensagem || "Nao foi possivel acessar a API.");
  }

  return dados;
}

function montarQuery(parametros = {}) {
  const query = new URLSearchParams();

  Object.entries(parametros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== null && String(valor).trim() !== "") {
      query.append(chave, String(valor).trim());
    }
  });

  const texto = query.toString();
  return texto ? `?${texto}` : "";
}

export async function buscarLivros(parametros = {}) {
  const dados = await request(`/livros${montarQuery(parametros)}`);
  return dados.livros || [];
}

export async function pesquisarLivros(termo = "", categoria = "Todos") {
  const filtrosBase = categoria !== "Todos" ? { categoria } : {};
  const termoLimpo = termo.trim();

  if (!termoLimpo) {
    return buscarLivros(filtrosBase);
  }

  const [porTitulo, porAutor] = await Promise.all([
    buscarLivros({ ...filtrosBase, titulo: termoLimpo }),
    buscarLivros({ ...filtrosBase, autor: termoLimpo }),
  ]);

  const livrosUnicos = new Map();
  [...porTitulo, ...porAutor].forEach((livro) => {
    livrosUnicos.set(livro.id, livro);
  });

  return Array.from(livrosUnicos.values());
}

export async function buscarCategorias() {
  const dados = await request("/categorias");
  return ["Todos", ...(dados.categorias || [])];
}

export async function criarLivro(livro) {
  const dados = await request("/livros", {
    method: "POST",
    autenticado: true,
    body: livro,
  });

  return dados.livro;
}

export async function editarLivro(id, livro) {
  const dados = await request(`/livros/${id}`, {
    method: "PUT",
    autenticado: true,
    body: livro,
  });

  return dados.livro;
}

export async function excluirLivro(id) {
  await request(`/livros/${id}`, {
    method: "DELETE",
    autenticado: true,
  });
}

export function precoLivro(livro) {
  const base = 29.9 + (Number(livro.id || 1) % 18) * 3.5;
  return Number(base.toFixed(2));
}

export function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
