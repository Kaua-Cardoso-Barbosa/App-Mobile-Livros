import { useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Cadastro from "./screens/Cadastro";
import Detalhes from "./screens/Detalhes";
import Favoritos from "./screens/Favoritos";
import Home from "./screens/Home";
import Login from "./screens/Login";
import { darkTheme, lightTheme } from "./components/theme";

const Stack = createNativeStackNavigator();

export default function App() {
  const [favoritos, setFavoritos] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const tema = darkMode ? darkTheme : lightTheme;

  const navigationTheme = useMemo(
    () => ({
      dark: darkMode,
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
    [darkMode, tema]
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

  function alternarTema() {
    setDarkMode((valor) => !valor);
  }

  const propsCompartilhadas = {
    favoritos,
    alternarFavorito,
    tema,
    darkMode,
    alternarTema,
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: tema.background },
        }}
      >
        <Stack.Screen name="Home">
          {(props) => <Home {...props} {...propsCompartilhadas} />}
        </Stack.Screen>
        <Stack.Screen name="Detalhes">
          {(props) => <Detalhes {...props} {...propsCompartilhadas} />}
        </Stack.Screen>
        <Stack.Screen name="Favoritos">
          {(props) => <Favoritos {...props} {...propsCompartilhadas} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {(props) => <Login {...props} {...propsCompartilhadas} />}
        </Stack.Screen>
        <Stack.Screen name="Cadastro">
          {(props) => <Cadastro {...props} {...propsCompartilhadas} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
