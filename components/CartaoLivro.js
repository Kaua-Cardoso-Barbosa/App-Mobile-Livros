import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { formatarPreco, precoLivro } from "../services/livrosApi";

export default function CartaoLivro({ livro, aoPressionar, aoFavoritar, favorito, tema }) {
  const preco = formatarPreco(precoLivro(livro));

  return (
    <Pressable
      style={({ pressed }) => [
        estilos.cartao,
        { backgroundColor: tema.surface, borderColor: tema.border, shadowColor: tema.shadow },
        pressed && estilos.pressionado,
      ]}
      onPress={aoPressionar}
    >
      <View style={estilos.areaCapa}>
        <Image source={{ uri: livro.imagem }} style={estilos.capa} resizeMode="cover" />
        <Pressable
          style={[estilos.botaoFavorito, { backgroundColor: tema.surface }]}
          onPress={aoFavoritar}
          hitSlop={10}
        >
          <Text style={[estilos.textoFavorito, { color: favorito ? tema.danger : tema.muted }]}>
            {favorito ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <View style={estilos.conteudo}>
        <Text style={[estilos.titulo, { color: tema.text }]} numberOfLines={2}>
          {livro.titulo}
        </Text>
        <Text style={[estilos.autor, { color: tema.muted }]} numberOfLines={1}>
          {livro.autor}
        </Text>
        <Text style={[estilos.preco, { color: tema.primary }]}>{preco}</Text>
        <Text style={[estilos.categoria, { color: tema.muted }]} numberOfLines={1}>
          {livro.categoria}
        </Text>
      </View>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  cartao: {
    width: "48%",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 14,
    overflow: "hidden",
    elevation: 3,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  pressionado: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  areaCapa: {
    height: 210,
    position: "relative",
  },
  capa: {
    width: "100%",
    height: "100%",
  },
  botaoFavorito: {
    position: "absolute",
    right: 8,
    top: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  textoFavorito: {
    fontSize: 22,
    lineHeight: 24,
  },
  conteudo: {
    padding: 10,
    gap: 4,
  },
  titulo: {
    minHeight: 39,
    fontSize: 15,
    fontWeight: "800",
  },
  autor: {
    fontSize: 12,
  },
  preco: {
    fontSize: 15,
    fontWeight: "900",
  },
  categoria: {
    fontSize: 11,
    fontWeight: "700",
  },
});
