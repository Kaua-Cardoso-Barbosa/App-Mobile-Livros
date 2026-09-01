import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function FiltroCategorias({ categorias, selecionada, aoSelecionar, tema }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.lista}
      style={estilos.container}
    >
      {categorias.map((categoria) => {
        const ativa = categoria === selecionada;

        return (
          <Pressable
            key={categoria}
            onPress={() => aoSelecionar(categoria)}
            style={[
              estilos.chip,
              {
                backgroundColor: ativa ? tema.primarySoft : tema.surface,
                borderColor: ativa ? tema.primary : tema.border,
              },
            ]}
          >
            <Text style={[estilos.textoChip, { color: ativa ? tema.primary : tema.muted }]}>
              {categoria}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    height: 52,
    maxHeight: 52,
    marginTop: 4,
    marginBottom: 4,
    flexGrow: 0,
  },
  lista: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingRight: 2,
  },
  chip: {
    height: 38,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textoChip: {
    fontSize: 13,
    fontWeight: "800",
  },
});
