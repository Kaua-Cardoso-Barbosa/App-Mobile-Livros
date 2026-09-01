import { getToken } from "./usuarioStorage";

const API_URL = "https://apps-api-livros.ucxocw.easypanel.host";

async function request(path, opcoes = {}) {
    const headers = {
        "Content-Type": "application/json",
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

export async function listarUsuarios() {
    const dados = await request("/usuarios", { autenticado: true });
    return dados.usuarios || [];
}

export async function criarUsuario(usuario) {
    const dados = await request("/usuarios", {
        method: "POST",
        body: usuario,
    });

    return dados.usuario;
}

export async function editarUsuario(id, usuario) {
    const dados = await request(`/usuarios/${id}`, {
        method: "PUT",
        autenticado: true,
        body: usuario,
    });

    return dados.usuario;
}

export async function excluirUsuario(id) {
    await request(`/usuarios/${id}`, {
        method: "DELETE",
        autenticado: true,
    });
}
