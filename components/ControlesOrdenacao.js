import { Pressable, StyleSheet, Text, View } from "react-native";

const opcoes = [
  { valor: "az", rotulo: "A-Z" },
  { valor: "preco-menor", rotulo: "Menor preco" },
  { valor: "preco-maior", rotulo: "Maior preco" },
];

export default function ControlesOrdenacao({ valor, aoMudar, tema }) {
  return (
    <View style={[estilos.container, { backgroundColor: tema.surfaceMuted }]}>
      {opcoes.map((opcao) => {
        const ativa = opcao.valor === valor;

        return (
          <Pressable
            key={opcao.valor}
            onPress={() => aoMudar(opcao.valor)}
            style={[estilos.opcao, ativa && { backgroundColor: tema.primary }]}
          >
            <Text style={[estilos.texto, { color: ativa ? "#FFFFFF" : tema.muted }]}>
              {opcao.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 4,
    flexDirection: "row",
    gap: 4,
  },
  opcao: {
    flex: 1,
    minHeight: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  texto: {
    fontSize: 12,
    fontWeight: "800",
    textAlign: "center",
  },
});
