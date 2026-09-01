import { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cadastro from "./screens/Cadastro";
import Detalhes from "./screens/Detalhes";
import Favoritos from "./screens/Favoritos";
import Home from "./screens/Home";
import LivroForm from "./screens/LivroForm";
import Login from "./screens/Login";
import UsuarioForm from "./screens/UsuarioForm";
import Usuarios from "./screens/Usuarios";
import Teste from "./screens/Teste";
import { lightTheme } from "./components/theme";
import { getUsuario, limparSessao } from "./services/usuario/usuarioStorage";

const Stack = createNativeStackNavigator();

export default function App() {
  const [favoritos, setFavoritos] = useState([]);
  const [autenticado, setAutenticado] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const tema = lightTheme;

  const navigationTheme = useMemo(
    () => ({
      dark: false,
      colors: {
        primary: tema.primary,
        background: tema.background,
        card: tema.surface,
        text: tema.text,
        border: tema.border,
        notification: tema.primary,
      },
      fonts: {
        regular: { fontFamily: "System", fontWeight: "400" },
        medium: { fontFamily: "System", fontWeight: "500" },
        bold: { fontFamily: "System", fontWeight: "700" },
        heavy: { fontFamily: "System", fontWeight: "900" },
      },
    }),
    [tema]
  );

  function alternarFavorito(livro) {
    setFavoritos((listaAtual) => {
      const existe = listaAtual.some((item) => item.id === livro.id);

      if (existe) {
        return listaAtual.filter((item) => item.id !== livro.id);
      }

      return [...listaAtual, livro];
    });
  }

  useEffect(() => {
    async function carregarSessao() {
      setCarregandoSessao(false);
    }

    carregarSessao();
  }, []);

  async function marcarLogado() {
    const usuario = await getUsuario();
    setUsuarioLogado(usuario || null);
    setAutenticado(true);
  }

  async function sair() {
    await limparSessao();
    setUsuarioLogado(null);
    setAutenticado(false);
  }

  const propsCompartilhadas = {
    favoritos,
    alternarFavorito,
    tema,
  };

  if (carregandoSessao) {
    return null;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {autenticado ? (
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tema.background },
          }}
        >
          <Stack.Screen name="Home">
            {(props) => <Home {...props} {...propsCompartilhadas} onLogout={sair} />}
          </Stack.Screen>
          <Stack.Screen name="Detalhes">
            {(props) => <Detalhes {...props} {...propsCompartilhadas} />}
          </Stack.Screen>
          <Stack.Screen name="Favoritos">
            {(props) => <Favoritos {...props} {...propsCompartilhadas} />}
          </Stack.Screen>
          <Stack.Screen name="LivroForm">
            {(props) => <LivroForm {...props} tema={tema} />}
          </Stack.Screen>
          <Stack.Screen name="Usuarios">
            {(props) => (
              <Usuarios
                {...props}
                tema={tema}
                usuarioLogado={usuarioLogado}
                onLogout={sair}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="UsuarioForm">
            {(props) => <UsuarioForm {...props} tema={tema} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: tema.background },
          }}
        >
          <Stack.Screen name="Cadastro">
            {(props) => <Cadastro {...props} {...propsCompartilhadas} />}
          </Stack.Screen>
          <Stack.Screen name="Login">
            {(props) => <Login {...props} {...propsCompartilhadas} onLogin={marcarLogado} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
