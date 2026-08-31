const API_URL = "https://apps-api-livros.ucxocw.easypanel.host";

async function request(path) {
  const resposta = await fetch(`${API_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!resposta.ok) {
    throw new Error("Nao foi possivel acessar a API.");
  }

  return resposta.json();
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
