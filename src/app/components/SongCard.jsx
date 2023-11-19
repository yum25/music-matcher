import { Text, Image, View } from "react-native"
import { StyleSheet } from "react-native";

export default function SongCard({ data }) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {data.album.title}
            </Text>
            {/* <Text style={styles.subtitle}>{JSON.stringify(data.artists)}</Text> */}
            <Image style={styles.image} source={data.album.images[0]} />
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
        height: "90%",
        width: "90%",
        alignSelf: "center",
        resizeMode: "contain"
    },
    title: {
        color: "white",
        alignSelf: "center",
        top: 40,
        fontSize: 20,
        fontWeight: "700",
    },
    subtitle: {

    }
  });