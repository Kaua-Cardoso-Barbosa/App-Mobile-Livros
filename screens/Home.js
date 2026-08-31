import { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BarraInferior from "../components/BarraInferior";
import BarraPesquisa from "../components/BarraPesquisa";
import CartaoLivro from "../components/CartaoLivro";
import ControlesOrdenacao from "../components/ControlesOrdenacao";
import EstadoFeedback from "../components/EstadoFeedback";
import FiltroCategorias from "../components/FiltroCategorias";
import { buscarCategorias, pesquisarLivros, precoLivro } from "../services/livrosApi";

export default function Home({
  navigation,
  favoritos,
  alternarFavorito,
  tema,
  darkMode,
  alternarTema,
}) {
  const [livros, setLivros] = useState([]);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [ordenacao, setOrdenacao] = useState("az");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarCategorias() {
      try {
        const lista = await buscarCategorias();
        if (ativo) {
          setCategorias(lista);
        }
      } catch {
        if (ativo) {
          setCategorias(["Todos"]);
        }
      }
    }

    carregarCategorias();
    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;
    setCarregando(true);
    setErro("");

    const tempo = setTimeout(async () => {
      try {
        const lista = await pesquisarLivros(busca, categoria);
        if (ativo) {
          setLivros(lista);
        }
      } catch {
        if (ativo) {
          setErro("Nao foi possivel carregar os livros. Tente novamente.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }, 350);

    return () => {
      ativo = false;
      clearTimeout(tempo);
    };
  }, [busca, categoria, atualizacao]);

  const livrosOrdenados = useMemo(() => {
    return [...livros].sort((a, b) => {
      if (ordenacao === "preco-menor") {
        return precoLivro(a) - precoLivro(b);
      }

      if (ordenacao === "preco-maior") {
        return precoLivro(b) - precoLivro(a);
      }

      return a.titulo.localeCompare(b.titulo, "pt-BR");
    });
  }, [livros, ordenacao]);

  function atualizar() {
    setAtualizacao((valor) => valor + 1);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.brand, { color: tema.text }]}>
              <Text style={{ color: tema.primary }}>Senai</Text> Book
            </Text>
            <Text style={[styles.subtitle, { color: tema.muted }]}>
              Encontre seu proximo livro
            </Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              style={[styles.loginButton, { backgroundColor: tema.primary }]}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginText}>Entrar</Text>
            </Pressable>
            <Pressable
              style={[styles.refresh, { backgroundColor: tema.surface, borderColor: tema.border }]}
              onPress={atualizar}
            >
              <Text style={[styles.refreshText, { color: tema.primary }]}>↻</Text>
            </Pressable>
          </View>
        </View>

        <BarraPesquisa
          valor={busca}
          aoMudarTexto={setBusca}
          aoLimpar={() => setBusca("")}
          tema={tema}
        />

        <FiltroCategorias
          categorias={categorias}
          selecionada={categoria}
          aoSelecionar={setCategoria}
          tema={tema}
        />

        <ControlesOrdenacao valor={ordenacao} aoMudar={setOrdenacao} tema={tema} />

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: tema.text }]}>Livros disponiveis</Text>
          <Text style={[styles.total, { color: tema.muted }]}>{livrosOrdenados.length} itens</Text>
        </View>

        {carregando ? (
          <EstadoFeedback tipo="carregando" mensagem="Carregando livros..." tema={tema} />
        ) : erro ? (
          <EstadoFeedback tipo="erro" mensagem={erro} aoTentarNovamente={atualizar} tema={tema} />
        ) : (
          <FlatList
            data={livrosOrdenados}
            keyExtractor={(item) => String(item.id)}
            numColumns={2}
            columnWrapperStyle={styles.columns}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EstadoFeedback
                tipo="vazio"
                mensagem="Nenhum livro encontrado para a pesquisa."
                tema={tema}
              />
            }
            renderItem={({ item }) => (
              <CartaoLivro
                livro={item}
                tema={tema}
                favorito={favoritos.some((livro) => livro.id === item.id)}
                aoFavoritar={() => alternarFavorito(item)}
                aoPressionar={() => navigation.navigate("Detalhes", { livro: item })}
              />
            )}
          />
        )}
      </View>
      <BarraInferior
        ativa="Home"
        navigation={navigation}
        tema={tema}
        darkMode={darkMode}
        aoAlternarTema={alternarTema}
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
    gap: 14,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loginButton: {
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  loginText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  refresh: {
    width: 46,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  refreshText: {
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  total: {
    fontSize: 13,
    fontWeight: "800",
  },
  list: {
    paddingBottom: 18,
  },
  columns: {
    justifyContent: "space-between",
  },
});
