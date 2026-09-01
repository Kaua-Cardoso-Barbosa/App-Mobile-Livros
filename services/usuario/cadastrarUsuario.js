import { salvarUsuario } from "./usuarioStorage";

export async function cadastrarUsuario(nome, email, senha) {
    const resposta = await fetch("https://apps-api-livros.ucxocw.easypanel.host/usuarios", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nome: nome,
            email: email,
            senha: senha,
        }),
    });

    const retorno = await resposta.json();

    if (!resposta.ok) {
        throw new Error(retorno.mensagem || "Nao foi possivel criar a conta.");
    }

    await salvarUsuario(retorno.usuario.id, retorno.usuario.nome, retorno.usuario.email);

    return retorno.usuario;
}
