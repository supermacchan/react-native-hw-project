import {
    StyleSheet,
    View,
    Text,
    Image,
    FlatList
} from "react-native";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { SinglePost } from "../../Components/SinglePost";

export const DefaultPostsScreen = ({ navigation }) => {
    const [posts, setPosts] = useState([]);

    const { nickname, email, avatar } = useSelector(state => state.auth);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const allPosts = [];
            querySnapshot.forEach(doc => {
                allPosts.push({ ...doc.data(), id: doc.id });
            });
            setPosts(allPosts);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            {/* Profile Container */}
            <View style={styles.profileContainer}>
                {/* Image Container */}
                <View style={styles.imgContainer}>
                    <Image
                        style={styles.image}
                        source={{ uri: avatar }}
                        // source={require('../../assets/test-avatar.jpg')}
                        objectFit='cover'
                    />
                </View>
                {/* Text Container */}
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{nickname}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
            </View>
            {/* Here for the testing */}
            {/* <SinglePost navigation={navigation}/> */}
            <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => (
                        <SinglePost
                            photo={item.photo}
                            title={item.title}
                            location={item.location}
                            navigation={navigation}
                            coords={item.coords}
                            postId={item.id}
                            likes={item.like}
                            country={item.country}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
    },
    profileContainer: {
        backgroundColor: '#fff',
        marginTop: 32,
        flexDirection: 'row',
        alignItems: 'center'
    },
    imgContainer: {
        backgroundColor: '#E8E8E8',
        width: 60,
        height: 60,
        borderRadius: 16,
    },
    textContainer: {
        marginLeft: 8
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 16
    },
    name: {
        fontFamily: "Roboto-Bold",
        fontSize: 13,
        color: '#212121'
    },
    email: {
        fontFamily: "Roboto-Regular",
        fontSize: 13,
        color: '#212121',
        opacity: 0.8
    }
})