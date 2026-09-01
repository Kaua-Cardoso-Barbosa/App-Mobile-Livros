import { useEffect, useState } from "react";
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BarraInferior from "../components/BarraInferior";
import BarraPesquisa from "../components/BarraPesquisa";
import CartaoLivro from "../components/CartaoLivro";
import EstadoFeedback from "../components/EstadoFeedback";
import FiltroCategorias from "../components/FiltroCategorias";
import { buscarCategorias, pesquisarLivros } from "../services/livrosApi";

export default function Home({
  route,
  navigation,
  favoritos,
  alternarFavorito,
  tema,
  onLogout,
}) {
  const [livros, setLivros] = useState([]);
  const [categorias, setCategorias] = useState(["Todos"]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    if (route.params?.atualizarEm) {
      setCategoria("Todos");
      setBusca("");
      setAtualizacao((valor) => valor + 1);
    }
  }, [route.params?.atualizarEm]);

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
              style={[styles.createButton, { backgroundColor: tema.primary }]}
              onPress={() => navigation.navigate("LivroForm")}
            >
              <Text style={styles.createButtonText}>+ Livro</Text>
            </Pressable>
            <Pressable
              style={[styles.logoutButton, { borderColor: tema.border, backgroundColor: tema.surface }]}
              onPress={onLogout}
            >
              <Text style={[styles.logoutText, { color: tema.muted }]}>Sair</Text>
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

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: tema.text }]}>Livros disponiveis</Text>
          <Text style={[styles.total, { color: tema.muted }]}>{livros.length} itens</Text>
        </View>

        {carregando ? (
          <EstadoFeedback tipo="carregando" mensagem="Carregando livros..." tema={tema} />
        ) : erro ? (
          <EstadoFeedback tipo="erro" mensagem={erro} aoTentarNovamente={atualizar} tema={tema} />
        ) : (
          <FlatList
            data={livros}
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
      <BarraInferior ativa="Home" navigation={navigation} tema={tema} />
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
    alignItems: "flex-end",
    gap: 8,
  },
  createButton: {
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  logoutButton: {
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  logoutText: {
    fontSize: 12,
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
