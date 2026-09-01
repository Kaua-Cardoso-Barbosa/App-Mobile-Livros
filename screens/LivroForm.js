import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { criarLivro, editarLivro } from "../services/livrosApi";

export default function LivroForm({ route, navigation, tema }) {
  const livro = route.params?.livro;
  const editando = Boolean(livro);
  const [imagem, setImagem] = useState(livro?.imagem || "");
  const [titulo, setTitulo] = useState(livro?.titulo || "");
  const [categoria, setCategoria] = useState(livro?.categoria || "");
  const [descricao, setDescricao] = useState(livro?.descricao || "");
  const [autor, setAutor] = useState(livro?.autor || "");
  const [faixaEtaria, setFaixaEtaria] = useState(livro?.faixa_etaria || "");
  const [salvando, setSalvando] = useState(false);

  function validarUrl(valor) {
    return /^https?:\/\/.+/i.test(valor.trim());
  }

  function dadosLivro() {
    return {
      imagem: imagem.trim(),
      titulo: titulo.trim(),
      categoria: categoria.trim(),
      descricao: descricao.trim(),
      autor: autor.trim(),
      faixa_etaria: faixaEtaria.trim(),
    };
  }

  function validar(dados) {
    if (!validarUrl(dados.imagem)) {
      return "Informe uma URL valida para a imagem.";
    }

    if (!dados.titulo || !dados.categoria || !dados.descricao || !dados.autor || !dados.faixa_etaria) {
      return "Preencha todas as informacoes do livro.";
    }

    return "";
  }

  async function salvar() {
    const dados = dadosLivro();
    const erro = validar(dados);

    if (erro) {
      Alert.alert(erro);
      return;
    }

    try {
      setSalvando(true);

      if (editando) {
        await editarLivro(livro.id, dados);
      } else {
        await criarLivro(dados);
      }

      navigation.navigate("Home", { atualizarEm: Date.now() });
    } catch (error) {
      Alert.alert(error.message || "Nao foi possivel salvar o livro.");
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
            {editando ? "Editar livro" : "Novo livro"}
          </Text>
          <View style={styles.topSpacer} />
        </View>

        <View style={[styles.form, { backgroundColor: tema.surface, borderColor: tema.border }]}>
          <Campo label="URL da imagem" value={imagem} onChangeText={setImagem} tema={tema} autoCapitalize="none" />
          <Campo label="Titulo" value={titulo} onChangeText={setTitulo} tema={tema} />
          <Campo label="Categoria" value={categoria} onChangeText={setCategoria} tema={tema} />
          <Campo label="Descricao" value={descricao} onChangeText={setDescricao} tema={tema} multiline />
          <Campo label="Autor" value={autor} onChangeText={setAutor} tema={tema} />
          <Campo label="Faixa etaria" value={faixaEtaria} onChangeText={setFaixaEtaria} tema={tema} />

          <Pressable
            style={[styles.saveButton, { backgroundColor: tema.primary }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveText}>{editando ? "Salvar alteracoes" : "Cadastrar livro"}</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Campo({ label, tema, multiline, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: tema.muted }]}>{label}</Text>
      <TextInput
        {...props}
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          { borderColor: tema.border, color: tema.text },
        ]}
        placeholderTextColor={tema.muted}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
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
  inputMultiline: {
    minHeight: 120,
    paddingTop: 12,
    lineHeight: 21,
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
