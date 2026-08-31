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
    marginTop: 4,
  },
  lista: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    minHeight: 36,
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
