import { Image, TouchableOpacity, View } from "react-native"
import { StyleSheet } from "react-native";

export default function SongCard({ data }) {
    return (
        <View style={styles.container}>

            <Image style={styles.image} source={data.album.images[0]} />
            <TouchableOpacity style={styles.button}>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      height: "65%",
      width: "80%",
      backgroundColor: "#122134",
      alignSelf: "center",
      borderRadius: 30,
      top: 75,
      position: "absolute"
    },
    image: {
        height: "100%",
        width: "90%",
        alignSelf: "center",
        resizeMode: "contain"
    },
    button: {
        tintColor: "white",
    }
  });