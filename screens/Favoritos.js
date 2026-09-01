import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BarraInferior from "../components/BarraInferior";
import CartaoLivro from "../components/CartaoLivro";
import EstadoFeedback from "../components/EstadoFeedback";

export default function Favoritos({
  navigation,
  favoritos,
  alternarFavorito,
  tema,
}) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.background }]}>
      <View style={styles.container}>
        <View>
          <Text style={[styles.brand, { color: tema.text }]}>
            <Text style={{ color: tema.primary }}>Meus</Text> Favoritos
          </Text>
          <Text style={[styles.subtitle, { color: tema.muted }]}>
            Sua estante particular
          </Text>
        </View>

        <FlatList
          data={favoritos}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.columns}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EstadoFeedback
              tipo="vazio"
              mensagem="Voce ainda nao adicionou livros aos favoritos."
              tema={tema}
            />
          }
          renderItem={({ item }) => (
            <CartaoLivro
              livro={item}
              tema={tema}
              favorito
              aoFavoritar={() => alternarFavorito(item)}
              aoPressionar={() => navigation.navigate("Detalhes", { livro: item })}
            />
          )}
        />
      </View>
      <BarraInferior
        ativa="Favoritos"
        navigation={navigation}
        tema={tema}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 18,
    gap: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "600",
  },
  list: {
    paddingBottom: 18,
  },
  columns: {
    justifyContent: "space-between",
  },
});
