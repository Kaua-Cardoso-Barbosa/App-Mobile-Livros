import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

const CHAVE_CREDENCIAIS = "credenciaisBiometricas";

export async function salvarUsuario(id, nome, email) {
    await AsyncStorage.setItem("usuario", JSON.stringify({
        nome: nome,
        email: email,
        id: id,
    }));
}

export async function salvarToken(token) {
    await AsyncStorage.setItem("token", token);
}

export async function getToken() {
    const token = await AsyncStorage.getItem("token");

    if (!token || !token.length) {
        return false;
    }

    return token;
}

export async function getUsuario() {
    const usuarioSalvo = await AsyncStorage.getItem("usuario");

    if (!usuarioSalvo || !usuarioSalvo.length) {
        return false;
    }

    return JSON.parse(usuarioSalvo);
}

export async function salvarCredenciaisBiometricas(email, senha) {
    const disponivel = await SecureStore.isAvailableAsync();

    if (!disponivel) {
        return false;
    }

    await SecureStore.setItemAsync(CHAVE_CREDENCIAIS, JSON.stringify({ email, senha }));
    return true;
}

export async function getCredenciaisBiometricas() {
    const disponivel = await SecureStore.isAvailableAsync();

    if (!disponivel) {
        return false;
    }

    const credenciais = await SecureStore.getItemAsync(CHAVE_CREDENCIAIS);

    if (!credenciais) {
        return false;
    }

    return JSON.parse(credenciais);
}

export async function limparDados() {
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("token");
    await SecureStore.deleteItemAsync(CHAVE_CREDENCIAIS);
}

export async function limparSessao() {
    await AsyncStorage.removeItem("usuario");
    await AsyncStorage.removeItem("token");
}
