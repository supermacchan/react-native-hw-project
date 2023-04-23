import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable
} from 'react-native';
import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

export const SinglePost = ({ navigation }) => {
    return (
        <View style={styles.post}>
            {/* Image container */}
            <View style={styles.imgContainer}>
                <Image
                    style={styles.image}
                    source={require('../assets/test-post.jpg')}
                    objectFit='cover'
                />
            </View>
            {/* Image title */}
            <Text style={styles.title}>Название</Text>
            {/* Comments-Location section */}
            <View style={styles.links}>
                {/* Comments Button */}
                <Pressable style={styles.commentsBtn} onPress={() => navigation.navigate("Comments")} >
                    <EvilIcons name="comment" size={24} color="#BDBDBD" />
                    <Text style={styles.comments}>000</Text>
                </Pressable>
                {/* Location Button */}
                <Pressable style={styles.locationBtn} onPress={() => navigation.navigate("Map")}>
                    <AntDesign name="enviromento" size={24} color="#BDBDBD" />
                    <Text style={styles.location}>Локация</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    post: {
        marginTop: 32
    },
    imgContainer: {
        height: 240,
        backgroundColor: '#E8E8E8',
        borderRadius: 8
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8
    },
    title: {
        fontFamily: "Roboto-Medium",
        fontSize: 16,
        color: '#212121',
        marginTop: 8,
    },
    links: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commentsBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    comments: {
        color: '#BDBDBD',
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        marginLeft: 6,
    },
    locationBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    location: {
        color: '#212121',
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        textDecorationLine: 'underline'
    }
})