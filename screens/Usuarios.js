import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import BarraInferior from "../components/BarraInferior";
import EstadoFeedback from "../components/EstadoFeedback";
import { excluirUsuario, listarUsuarios } from "../services/usuario/usuariosApi";

export default function Usuarios({ route, navigation, tema, usuarioLogado, onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

  useEffect(() => {
    if (route.params?.atualizarEm) {
      setAtualizacao((valor) => valor + 1);
    }
  }, [route.params?.atualizarEm]);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuarios() {
      try {
        setCarregando(true);
        setErro("");
        const lista = await listarUsuarios();

        if (ativo) {
          setUsuarios(lista);
        }
      } catch (error) {
        if (ativo) {
          setErro(error.message || "Nao foi possivel carregar os usuarios.");
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    carregarUsuarios();
    return () => {
      ativo = false;
    };
  }, [atualizacao]);

  function atualizar() {
    setAtualizacao((valor) => valor + 1);
  }

  function confirmarExclusao(usuario) {
    async function remover() {
      try {
        await excluirUsuario(usuario.id);
        await onLogout();
      } catch (error) {
        Alert.alert(error.message || "Nao foi possivel excluir o usuario.");
      }
    }

    Alert.alert("Excluir usuario", `Deseja excluir ${usuario.nome}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: remover },
    ]);
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.brand, { color: tema.text }]}>
              <Text style={{ color: tema.primary }}>Usuarios</Text>
            </Text>
            <Text style={[styles.subtitle, { color: tema.muted }]}>
              Gerencie as contas do app
            </Text>
          </View>
          <Pressable
            style={[styles.createButton, { backgroundColor: tema.primary }]}
            onPress={() => navigation.navigate("UsuarioForm")}
          >
            <Text style={styles.createButtonText}>+ Usuario</Text>
          </Pressable>
        </View>

        {carregando ? (
          <EstadoFeedback tipo="carregando" mensagem="Carregando usuarios..." tema={tema} />
        ) : erro ? (
          <EstadoFeedback tipo="erro" mensagem={erro} aoTentarNovamente={atualizar} tema={tema} />
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <EstadoFeedback tipo="vazio" mensagem="Nenhum usuario encontrado." tema={tema} />
            }
            renderItem={({ item }) => {
              const propriaConta = String(item.id) === String(usuarioLogado?.id);

              return (
                <View style={[styles.card, { backgroundColor: tema.surface, borderColor: tema.border }]}>
                  <View style={styles.cardContent}>
                    <Text style={[styles.userName, { color: tema.text }]} numberOfLines={1}>
                      {item.nome}
                    </Text>
                    <Text style={[styles.userEmail, { color: tema.muted }]} numberOfLines={1}>
                      {item.email}
                    </Text>
                    <Text style={[styles.userId, { color: tema.muted }]}>#{item.id}</Text>
                  </View>
                  {propriaConta ? (
                    <View style={styles.actions}>
                      <Pressable
                        style={[styles.actionButton, { backgroundColor: tema.primary }]}
                        onPress={() => navigation.navigate("UsuarioForm", { usuario: item })}
                      >
                        <Text style={styles.actionPrimaryText}>Editar</Text>
                      </Pressable>
                      <Pressable
                        style={[styles.actionButton, { borderColor: tema.danger, borderWidth: 1 }]}
                        onPress={() => confirmarExclusao(item)}
                      >
                        <Text style={[styles.actionDangerText, { color: tema.danger }]}>Excluir</Text>
                      </Pressable>
                    </View>
                  ) : (
                    <Text style={[styles.readOnlyText, { color: tema.muted }]}>Somente visualizacao</Text>
                  )}
                </View>
              );
            }}
          />
        )}
      </View>
      <BarraInferior ativa="Usuarios" navigation={navigation} tema={tema} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  list: {
    paddingBottom: 18,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    gap: 12,
  },
  cardContent: {
    gap: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: "900",
  },
  userEmail: {
    fontSize: 14,
    fontWeight: "700",
  },
  userId: {
    fontSize: 12,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  actionPrimaryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  actionDangerText: {
    fontSize: 13,
    fontWeight: "900",
  },
  readOnlyText: {
    fontSize: 12,
    fontWeight: "800",
  },
});
