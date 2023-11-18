import { useState, useEffect, useRef } from "react";
import { Animated, Text, View, TouchableOpacity } from "react-native";
import { StyleSheet } from "react-native";
import SongCard from "./components/SongCard";

export default function SongSwipe({ navigation }) {
    const [songs, setSongs] = useState([]);
    const [startOver, setStartOver] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0.3)).current;
    const fadeAnim2 = useRef(fadeAnim.interpolate({
        inputRange: [0.3, 1],
        outputRange: [1, 0.3]
    })).current;
    const fadeAnim3 = useRef(fadeAnim.interpolate({
        inputRange: [0.3, 0.5, 1],
        outputRange: [0.5, 1, 0.3]
    })).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence(
                [
                    Animated.timing(fadeAnim, {
                        toValue: 1,
                        duration: 1000,
                        useNativeDriver: true,
                      }),
                    Animated.timing(fadeAnim, {
                        toValue: 0.3,
                        duration: 1000,
                        useNativeDriver: true,
                    }),
                ]
            )
        ).start()
      }, [fadeAnim]);

      useEffect(() => {
        if (startOver) {
            fetch("http://35.3.136.12:5000").then(
            (resp) => {
                if (!resp.ok) {
                    throw Error; 
                }
                return resp.json()
            })
            .then((data) => {
                setSongs(data);
                setStartOver(false);
                console.log(data);
            })
        }
      }, [startOver])
    return (
        <View style={styles.container}>
            <Animated.Image style={[styles.star, {top: 100, opacity: fadeAnim}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 75, left: 175, width: 30, height: 30, opacity: fadeAnim}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 300, right: 10, width: 30, height: 30, opacity: fadeAnim}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 50, right: 30, opacity: fadeAnim2}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 100, right: 120, width: 30, height: 30, opacity: fadeAnim2}]} source={require('../assets/stars2.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 450, left: 1, width: 30, height: 30, opacity: fadeAnim2}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 180, right: 100, width: 30, height: 30, opacity: fadeAnim3}]} source={require('../assets/stars2.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 150, left: 70, opacity: fadeAnim}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 50, left: 100, width: 30, height: 30, opacity: fadeAnim2}]} source={require('../assets/stars2.png')}/> 
            <Animated.Image style={[styles.star, {top: 100, right: 10, width: 30, height: 30, opacity: fadeAnim}]} source={require('../assets/stars2.png')}/> 
            <Animated.Image style={[styles.star, {top: 270, right: 10, opacity: fadeAnim}]} source={require('../assets/stars1.png')}/> 
            <Animated.Image style={[styles.star, {bottom: 250, left: 15, width: 30, height: 30, opacity: fadeAnim3}]} source={require('../assets/stars2.png')}/>
            {
                songs.map((song) => <SongCard data={song} key={song.id}/>)
            }
            <TouchableOpacity 
                style={[styles.button, {bottom: 100, left: 30}]}
                onPress={() => setStartOver(true)}
            >
                <Text style={styles.text}>
                    Start Over
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.button, {bottom: 100, right: 30, backgroundColor: "#fdc518"}]}
                onPress={() => navigation.navigate("Home")}
            >
                <Text style={styles.text}>
                    Exit
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#071524",
        flex: 1,
    },
    star: {
        width: 50,
        height: 50,
        tintColor: "white",
        position: 'absolute',
    },
    text: {
        color: "white",
        fontSize: 20,
        alignSelf: "center",
    },
    button: {
        backgroundColor: "orange",
        width: "35%",
        height: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: "white",
        justifyContent: "center",
        position: 'absolute',

    }
  });