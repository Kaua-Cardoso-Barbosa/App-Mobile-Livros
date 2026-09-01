import { Alert, Image, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { excluirLivro, formatarPreco, precoLivro } from "../services/livrosApi";

export default function Detalhes({ route, navigation, favoritos, alternarFavorito, tema }) {
  const { livro } = route.params;
  const favorito = favoritos.some((item) => item.id === livro.id);

  async function removerLivro() {
    async function confirmarExclusao() {
      try {
        await excluirLivro(livro.id);
        navigation.navigate("Home", { atualizarEm: Date.now() });
      } catch (error) {
        Alert.alert(error.message || "Nao foi possivel excluir o livro.");
      }
    }

    Alert.alert("Excluir livro", "Deseja excluir este livro da API?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: confirmarExclusao },
    ]);
  }

  const informacoes = [
    ["Autor", livro.autor],
    ["Categoria", livro.categoria],
    ["Faixa etaria", livro.faixa_etaria],
    ["Codigo", `#${livro.id}`],
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: tema.surface, borderColor: tema.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.icon, { color: tema.text }]}>‹</Text>
          </Pressable>
          <Text style={[styles.brand, { color: tema.text }]}>
            <Text style={{ color: tema.primary }}>Livraria</Text> Digital
          </Text>
          <Pressable
            style={[styles.iconButton, { backgroundColor: tema.surface, borderColor: tema.border }]}
            onPress={() => alternarFavorito(livro)}
          >
            <Text style={[styles.heart, { color: favorito ? tema.danger : tema.muted }]}>
              {favorito ? "♥" : "♡"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.coverArea}>
          <Image source={{ uri: livro.imagem }} style={styles.cover} resizeMode="cover" />
        </View>

        <Text style={[styles.title, { color: tema.text }]}>{livro.titulo}</Text>
        <Text style={[styles.author, { color: tema.muted }]}>{livro.autor}</Text>
        <Text style={[styles.price, { color: tema.primary }]}>{formatarPreco(precoLivro(livro))}</Text>

        <View style={styles.tags}>
          <Text style={[styles.tag, { color: tema.primary, backgroundColor: tema.primarySoft }]}>
            {livro.categoria}
          </Text>
          <Text style={[styles.tag, { color: tema.muted, backgroundColor: tema.surfaceMuted }]}>
            {livro.faixa_etaria}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: tema.text }]}>Sinopse</Text>
        <Text style={[styles.description, { color: tema.muted }]}>{livro.descricao}</Text>

        <Text style={[styles.sectionTitle, { color: tema.text }]}>Informacoes</Text>
        <View style={[styles.infoBox, { backgroundColor: tema.surface, borderColor: tema.border }]}>
          {informacoes.map(([label, value]) => (
            <View key={label} style={[styles.infoRow, { borderColor: tema.border }]}>
              <Text style={[styles.infoLabel, { color: tema.muted }]}>{label}</Text>
              <Text style={[styles.infoValue, { color: tema.text }]}>{value}</Text>
            </View>
          ))}
        </View>

        <Pressable style={[styles.buyButton, { backgroundColor: tema.primary }]}>
          <Text style={styles.buyText}>Comprar agora</Text>
        </Pressable>
        <View style={styles.adminActions}>
          <Pressable
            style={[styles.adminButton, { backgroundColor: tema.primary }]}
            onPress={() => navigation.navigate("LivroForm", { livro })}
          >
            <Text style={styles.adminPrimaryText}>Editar</Text>
          </Pressable>
          <Pressable
            style={[styles.adminButton, { borderColor: tema.danger, borderWidth: 1 }]}
            onPress={removerLivro}
          >
            <Text style={[styles.adminDangerText, { color: tema.danger }]}>Excluir</Text>
          </Pressable>
        </View>
        <Pressable
          style={[styles.favoriteButton, { borderColor: tema.primary }]}
          onPress={() => alternarFavorito(livro)}
        >
          <Text style={[styles.favoriteText, { color: tema.primary }]}>
            {favorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 34,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 34,
    lineHeight: 36,
  },
  heart: {
    fontSize: 26,
    lineHeight: 28,
  },
  brand: {
    fontSize: 24,
    fontWeight: "900",
  },
  coverArea: {
    alignItems: "center",
    marginBottom: 22,
  },
  cover: {
    width: 210,
    height: 315,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: "900",
  },
  author: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "700",
  },
  price: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "900",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 14,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
    fontWeight: "900",
  },
  sectionTitle: {
    marginTop: 22,
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "900",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  infoRow: {
    minHeight: 44,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 14,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "800",
  },
  infoValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "800",
  },
  buyButton: {
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  buyText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  adminActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  adminButton: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  adminPrimaryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  adminDangerText: {
    fontSize: 15,
    fontWeight: "900",
  },
  favoriteButton: {
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  favoriteText: {
    fontSize: 15,
    fontWeight: "900",
  },
});
