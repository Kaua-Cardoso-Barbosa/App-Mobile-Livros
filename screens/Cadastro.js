import { Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

export default function Cadastro({ navigation, tema }) {
  return (
    <SafeAreaView style={[estilos.safe, { backgroundColor: tema.surface }]}>
      <View style={estilos.container}>
        <Text style={[estilos.marca, { color: tema.text }]}>
          <Text style={{ color: tema.primary }}>SENAI</Text> Book
        </Text>

        <View style={estilos.cabecalho}>
          <Text style={[estilos.titulo, { color: tema.text }]}>Crie sua conta</Text>
          <Text style={[estilos.subtitulo, { color: tema.muted }]}>
            Cadastre-se para montar sua biblioteca e descobrir novos livros.
          </Text>
        </View>

        <Image source={require("../assets/auth-books.png")} style={estilos.ilustracao} />

        <View style={estilos.formulario}>
          <CampoAutenticacao icone="♙" placeholder="Nome" tema={tema} />
          <CampoAutenticacao icone="✉" placeholder="E-mail" tema={tema} />
          <CampoAutenticacao icone="▣" placeholder="Senha" seguro tema={tema} />
          <CampoAutenticacao icone="▣" placeholder="Confirmar senha" seguro tema={tema} />
          <Pressable
            style={[estilos.botaoPrimario, { backgroundColor: tema.primary }]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={estilos.textoBotao}>Criar conta</Text>
          </Pressable>
        </View>

        <View style={estilos.rodape}>
          <Text style={[estilos.textoRodape, { color: tema.muted }]}>Ja tem conta?</Text>
          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text style={[estilos.link, { color: tema.primary }]}>Entrar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function CampoAutenticacao({ icone, placeholder, seguro, tema }) {
  return (
    <View style={[estilos.campoWrapper, { borderColor: tema.border }]}>
      <Text style={[estilos.iconeCampo, { color: tema.muted }]}>{icone}</Text>
      <TextInput
        style={[estilos.campo, { color: tema.text }]}
        placeholder={placeholder}
        placeholderTextColor={tema.muted}
        secureTextEntry={seguro}
      />
      {seguro && <Text style={[estilos.olho, { color: tema.muted }]}>◉</Text>}
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
    paddingTop: 48,
    alignItems: "center",
  },
  marca: {
    fontSize: 32,
    fontWeight: "900",
  },
  cabecalho: {
    marginTop: 20,
    alignItems: "center",
    gap: 8,
  },
  titulo: {
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },
  subtitulo: {
    maxWidth: 300,
    fontSize: 15,
    lineHeight: 23,
    fontWeight: "500",
    textAlign: "center",
  },
  ilustracao: {
    width: 298,
    height: 190,
    marginTop: 14,
    marginBottom: 18,
    resizeMode: "contain",
  },
  formulario: {
    width: "100%",
    gap: 10,
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
    fontSize: 20,
    textAlign: "center",
  },
  campo: {
    flex: 1,
    height: "100%",
    fontSize: 15,
  },
  olho: {
    fontSize: 18,
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
  textoBotao: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  rodape: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  textoRodape: {
    fontSize: 14,
    fontWeight: "600",
  },
});
