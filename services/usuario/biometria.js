import * as LocalAuthentication from "expo-local-authentication";

export async function getBiometria() {
    try {
        // Verifica se o aparelho possui leitor biometrico.
        const possuiBiometria = await LocalAuthentication.hasHardwareAsync();

        if (!possuiBiometria) {
            console.log("Nao possui biometria");
            return false;
        }

        // Verifica se existe biometria cadastrada no aparelho.
        const biometriaCadastrada = await LocalAuthentication.isEnrolledAsync();

        if (!biometriaCadastrada) {
            console.log("Nao possui biometria cadastrada");
            return false;
        }

        const resultado = await LocalAuthentication.authenticateAsync({
            promptMessage: "Confirme sua identidade",
            promptDescription: "Use a biometria do aparelho para continuar",
            cancelLabel: "Cancelar",
            fallbackLabel: "Usar senha",
        });

        if (resultado.success) {
            console.log("Biometria validada com sucesso");
            return true;
        }

        console.log("Biometria nao validada", resultado.error);
        return false;
    } catch (erro) {
        console.log("Erro ao validar biometria", erro);
        return false;
    }
}
