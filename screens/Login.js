import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";
import { getBiometria } from "../services/usuario/biometria";
import { realizarLogin } from "../services/usuario/realizarLogin";
import { getCredenciaisBiometricas, salvarCredenciaisBiometricas } from "../services/usuario/usuarioStorage";

export default function Login({ route, navigation, tema, onLogin }) {
  const [email, setEmail] = useState(route.params?.email || "");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [carregandoBiometria, setCarregandoBiometria] = useState(false);
  const [temBiometriaSalva, setTemBiometriaSalva] = useState(false);

  useEffect(() => {
    if (route.params?.email) {
      setEmail(route.params.email);
    }
  }, [route.params?.email]);

  useEffect(() => {
    async function carregarBiometria() {
      const credenciais = await getCredenciaisBiometricas();
      setTemBiometriaSalva(Boolean(credenciais));
    }

    carregarBiometria();
  }, []);

  function emailValido(valor) {
    return valor.includes("@gmail.com");
  }

  function entrarNoApp() {
    onLogin();
  }

  async function entrar() {
    const emailLimpo = email.trim().toLowerCase();

    if (!emailValido(emailLimpo)) {
      Alert.alert("Informe um e-mail com @gmail.com.");
      return;
    }

    if (senha.length < 4) {
      Alert.alert("A senha precisa ter no minimo 4 caracteres.");
      return;
    }

    try {
      setCarregando(true);
      await realizarLogin(emailLimpo, senha);

      const biometriaConfirmada = await getBiometria();
      if (biometriaConfirmada) {
        await salvarCredenciaisBiometricas(emailLimpo, senha);
        setTemBiometriaSalva(true);
      }

      entrarNoApp();
    } catch (error) {
      Alert.alert(error.message || "Nao foi possivel entrar.");
    } finally {
      setCarregando(false);
    }
  }

  async function entrarComBiometria() {
    try {
      setCarregandoBiometria(true);
      const credenciais = await getCredenciaisBiometricas();

      if (!credenciais) {
        Alert.alert("Entre com e-mail e senha uma vez para ativar a biometria.");
        return;
      }

      const biometriaConfirmada = await getBiometria();

      if (!biometriaConfirmada) {
        Alert.alert("Biometria nao validada.");
        return;
      }

      await realizarLogin(credenciais.email, credenciais.senha);
      entrarNoApp();
    } catch (error) {
      Alert.alert(error.message || "Nao foi possivel entrar com biometria.");
    } finally {
      setCarregandoBiometria(false);
    }
  }

  return (
    <SafeAreaView style={[estilos.safe, { backgroundColor: tema.surface }]}>
      <View style={estilos.container}>
        <Text style={[estilos.marca, { color: tema.text }]}>
          <Text style={{ color: tema.primary }}>SENAI</Text> Book
        </Text>

        <View style={estilos.cabecalho}>
          <Text style={[estilos.titulo, { color: tema.text }]}>Bem-vindo de volta</Text>
          <Text style={[estilos.subtitulo, { color: tema.muted }]}>
            Entre para acessar sua biblioteca e descobrir novos livros.
          </Text>
        </View>

        <Image source={require("../assets/auth-books.png")} style={estilos.ilustracao} />

        <View style={estilos.formulario}>
          <CampoAutenticacao
            icone="e"
            placeholder="E-mail"
            tema={tema}
            valor={email}
            aoMudar={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <CampoAutenticacao
            icone="*"
            placeholder="Senha"
            seguro
            tema={tema}
            valor={senha}
            aoMudar={setSenha}
          />
          <Pressable style={estilos.linkSenha}>
            <Text style={[estilos.link, { color: tema.primary }]}>Esqueci minha senha</Text>
          </Pressable>
          <Pressable
            style={[estilos.botaoPrimario, { backgroundColor: tema.primary }]}
            onPress={entrar}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={estilos.textoBotao}>Entrar</Text>
            )}
          </Pressable>
          <Pressable
            style={[
              estilos.botaoBiometria,
              { borderColor: tema.primary, opacity: temBiometriaSalva ? 1 : 0.55 },
            ]}
            onPress={entrarComBiometria}
            disabled={carregandoBiometria}
          >
            {carregandoBiometria ? (
              <ActivityIndicator color={tema.primary} />
            ) : (
              <Text style={[estilos.textoBiometria, { color: tema.primary }]}>
                Entrar com biometria
              </Text>
            )}
          </Pressable>
        </View>

        <View style={estilos.rodape}>
          <Text style={[estilos.textoRodape, { color: tema.muted }]}>Nao tem conta?</Text>
          <Pressable onPress={() => navigation.navigate("Cadastro")}>
            <Text style={[estilos.link, { color: tema.primary }]}>Criar conta</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function CampoAutenticacao({
  icone,
  placeholder,
  seguro,
  tema,
  valor,
  aoMudar,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) {
  return (
    <View style={[estilos.campoWrapper, { borderColor: tema.border }]}>
      <Text style={[estilos.iconeCampo, { color: tema.muted }]}>{icone}</Text>
      <TextInput
        style={[estilos.campo, { color: tema.text }]}
        placeholder={placeholder}
        placeholderTextColor={tema.muted}
        secureTextEntry={seguro}
        value={valor}
        onChangeText={aoMudar}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 54,
    alignItems: "center",
  },
  marca: {
    fontSize: 32,
    fontWeight: "900",
  },
  cabecalho: {
    marginTop: 26,
    alignItems: "center",
    gap: 8,
  },
  titulo: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitulo: {
    maxWidth: 290,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "500",
    textAlign: "center",
  },
  ilustracao: {
    width: 298,
    height: 190,
    marginTop: 18,
    marginBottom: 22,
    resizeMode: "contain",
  },
  formulario: {
    width: "100%",
    gap: 12,
  },
  campoWrapper: {
    height: 54,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconeCampo: {
    width: 20,
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
  },
  campo: {
    flex: 1,
    height: "100%",
    fontSize: 15,
  },
  linkSenha: {
    alignSelf: "flex-end",
  },
  link: {
    fontSize: 14,
    fontWeight: "800",
  },
  botaoPrimario: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  botaoBiometria: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  textoBiometria: {
    fontSize: 15,
    fontWeight: "900",
  },
  rodape: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  textoRodape: {
    fontSize: 14,
    fontWeight: "600",
  },
});
