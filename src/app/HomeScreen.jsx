import { View, Text, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <Text>Music Matcher</Text>
            <Text>Find local artists in Ann Arbor!</Text>
            <Text>Swipe by:</Text>
            <TouchableOpacity>
                <Text>Artist</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("SongSwipe")}>
                <Text>Song</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });