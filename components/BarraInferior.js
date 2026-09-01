import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BarraInferior({ ativa, navigation, tema }) {
  const itens = [
    { chave: "Home", rotulo: "Inicio", icone: "H" },
    { chave: "Favoritos", rotulo: "Favoritos", icone: "F" },
    { chave: "Usuarios", rotulo: "Usuarios", icone: "U" },
  ];

  return (
    <View style={[estilos.barra, { backgroundColor: tema.surface, borderColor: tema.border }]}>
      {itens.map((item) => {
        const itemAtivo = item.chave === ativa;

        return (
          <Pressable
            key={item.chave}
            style={estilos.item}
            onPress={() => navigation.navigate(item.chave)}
          >
            <Text style={[estilos.icone, { color: itemAtivo ? tema.primary : tema.muted }]}>
              {item.icone}
            </Text>
            <Text style={[estilos.rotulo, { color: itemAtivo ? tema.primary : tema.muted }]}>
              {item.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const estilos = StyleSheet.create({
  barra: {
    height: 72,
    borderTopWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingBottom: 8,
  },
  item: {
    width: 96,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icone: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: "900",
  },
  rotulo: {
    fontSize: 11,
    fontWeight: "800",
  },
});
