import {Button, View, StyleSheet, Alert} from "react-native";
import {getBiometria} from "../services/usuario/biometria";

export default function Teste(){

    async function testarBiometria() {
        var biometria = await getBiometria();

        if (biometria) {
            Alert.alert("Biometria sucesso!")
        } else {
            Alert.alert("Erro na biometria!")
        }
    }

    return (
        <View style={styles.container}>
            <Button title={"Testar Biometria"}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
})