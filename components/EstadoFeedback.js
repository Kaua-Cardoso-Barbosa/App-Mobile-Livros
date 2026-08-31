import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

export default function EstadoFeedback({ tipo, mensagem, aoTentarNovamente, tema }) {
  const carregando = tipo === "carregando";

  return (
    <View style={[estilos.container, { backgroundColor: tema.surface, borderColor: tema.border }]}>
      {carregando ? (
        <ActivityIndicator size="large" color={tema.primary} />
      ) : (
        <Text style={[estilos.icone, { color: tema.muted }]}>{tipo === "erro" ? "!" : "⌕"}</Text>
      )}
      <Text style={[estilos.mensagem, { color: tema.text }]}>{mensagem}</Text>
      {aoTentarNovamente && !carregando && (
        <Pressable
          style={[estilos.botao, { backgroundColor: tema.primary }]}
          onPress={aoTentarNovamente}
        >
          <Text style={estilos.textoBotao}>Tentar novamente</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    minHeight: 180,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  icone: {
    fontSize: 34,
    fontWeight: "900",
  },
  mensagem: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  botao: {
    minHeight: 42,
    borderRadius: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  textoBotao: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});
