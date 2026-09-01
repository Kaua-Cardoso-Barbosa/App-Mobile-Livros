import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { criarUsuario, editarUsuario } from "../services/usuario/usuariosApi";

export default function UsuarioForm({ route, navigation, tema }) {
  const usuario = route.params?.usuario;
  const editando = Boolean(usuario);
  const [nome, setNome] = useState(usuario?.nome || "");
  const [email, setEmail] = useState(usuario?.email || "");
  const [senha, setSenha] = useState("");
  const [salvando, setSalvando] = useState(false);

  function emailValido(valor) {
    return valor.includes("@gmail.com");
  }

  function dadosUsuario() {
    return {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha: senha.trim(),
    };
  }

  function validar(dados) {
    if (!dados.nome) {
      return "Informe o nome do usuario.";
    }

    if (!emailValido(dados.email)) {
      return "Informe um e-mail com @gmail.com.";
    }

    if (dados.senha.length < 4) {
      return "A senha precisa ter no minimo 4 caracteres.";
    }

    return "";
  }

  async function salvar() {
    const dados = dadosUsuario();
    const erro = validar(dados);

    if (erro) {
      Alert.alert(erro);
      return;
    }

    try {
      setSalvando(true);

      if (editando) {
        await editarUsuario(usuario.id, dados);
      } else {
        await criarUsuario(dados);
      }

      navigation.navigate("Usuarios", { atualizarEm: Date.now() });
    } catch (error) {
      Alert.alert(error.message || "Nao foi possivel salvar o usuario.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: tema.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: tema.surface, borderColor: tema.border }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.iconText, { color: tema.text }]}>{"<"}</Text>
          </Pressable>
          <Text style={[styles.title, { color: tema.text }]}>
            {editando ? "Editar usuario" : "Novo usuario"}
          </Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={[styles.form, { backgroundColor: tema.surface, borderColor: tema.border }]}>
          <Campo label="Nome" value={nome} onChangeText={setNome} tema={tema} />
          <Campo
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            tema={tema}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Campo
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            tema={tema}
            secureTextEntry
          />

          <Pressable
            style={[styles.saveButton, { backgroundColor: tema.primary }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>{editando ? "Salvar alteracoes" : "Cadastrar usuario"}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Campo({ label, tema, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: tema.muted }]}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, { borderColor: tema.border, color: tema.text }]}
        placeholderTextColor={tema.muted}
      />
    </View>
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
  iconText: {
    fontSize: 34,
    lineHeight: 36,
  },
  topSpacer: {
    width: 44,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
  },
  form: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "800",
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  saveButton: {
    height: 52,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
