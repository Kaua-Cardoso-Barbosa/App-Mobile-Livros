import { Pressable, StyleSheet, Text, View } from "react-native";

export default function BarraInferior({ ativa, navigation, tema, darkMode, aoAlternarTema }) {
  const itens = [
    { chave: "Home", rotulo: "Inicio", icone: "⌂" },
    { chave: "Favoritos", rotulo: "Favoritos", icone: "♡" },
    { chave: "Login", rotulo: "Entrar", icone: "◉" },
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

      <Pressable style={estilos.item} onPress={aoAlternarTema}>
        <Text style={[estilos.icone, { color: tema.muted }]}>{darkMode ? "☀" : "☾"}</Text>
        <Text style={[estilos.rotulo, { color: tema.muted }]}>Tema</Text>
      </Pressable>
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
    width: 82,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  icone: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "900",
  },
  rotulo: {
    fontSize: 11,
    fontWeight: "800",
  },
});
