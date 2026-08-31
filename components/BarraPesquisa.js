import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function BarraPesquisa({ valor, aoMudarTexto, aoLimpar, tema }) {
  return (
    <View style={[estilos.container, { backgroundColor: tema.surface, borderColor: tema.border }]}>
      <Text style={[estilos.icone, { color: tema.muted }]}>⌕</Text>
      <TextInput
        style={[estilos.campo, { color: tema.text }]}
        placeholder="Buscar por titulo ou autor"
        placeholderTextColor={tema.muted}
        value={valor}
        onChangeText={aoMudarTexto}
      />
      {valor.length > 0 && (
        <Pressable onPress={aoLimpar} hitSlop={10}>
          <Text style={[estilos.limpar, { color: tema.muted }]}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  icone: {
    fontSize: 24,
    fontWeight: "700",
  },
  campo: {
    flex: 1,
    height: "100%",
    fontSize: 15,
  },
  limpar: {
    fontSize: 26,
    lineHeight: 28,
  },
});
