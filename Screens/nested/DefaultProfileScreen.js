import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    Image,
    Pressable,
    SafeAreaView,
    FlatList
} from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  where,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { authSingOutUser } from '../../redux/auth/operations';
import { useDispatch } from 'react-redux';
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { SinglePost } from "../../Components/SinglePost";

export const DefaultProfileScreen = ({ navigation }) => {
    const [photo, setPhoto] = useState(null);
    const [posts, setPosts] = useState([]);

    const { nickname, avatar, userId } = useSelector(state => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        setPhoto(avatar);
        const q = query(collection(db, 'posts'), where('userId', '==', userId));
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

    const pickAvatar = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

    return (
        <View style={styles.container}>
            <ImageBackground
                style={styles.background}
                source={require("../../assets/background.jpg")}
            >
                {/* Profile Container */}
                <View style={styles.profile}>
                    {/* Контейнер для аватарки */}
                    <View style={styles.avatar}>
                        <Image source={{ uri: photo }} style={styles.avatarImg} />
                    </View>
                    {/* Кнопка добавить / удалить аватарку */}
                    {!photo ? (
                        <Pressable style={styles.avatarBtn} onPress={pickAvatar}>
                            <Text style={styles.addAvatar}>
                                <AntDesign name="plus" size={20} color="#FF6C00" />
                            </Text>
                        </Pressable>
                        ) : (
                        <Pressable style={styles.avatarBtn} onPress={() => setPhoto(null) } >
                            <Text style={styles.delAvatar}>
                                <AntDesign name="close" size={20} color="#BDBDBD" />
                            </Text>
                        </Pressable>
                    )}
                    <Pressable
                        style={styles.logoutIcon}
                        onPress={() => dispatch(authSingOutUser())}
                    >
                        <MaterialIcons name="logout" size={24} color="#BDBDBD" />
                    </Pressable>
                    <Text style={styles.title}>{nickname}</Text>
                    {/* Here for the testing */}
                    {/* <SinglePost navigation={navigation} /> */}
                    <SafeAreaView style={{ flex: 1, width: '100%', marginTop: 32 }}>
                        {/* safe area not working */}
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
            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: 'flex-end',
    },
    profile: {
        paddingTop: 32,
        paddingBottom: 45,
        paddingHorizontal: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
    },
    avatar: {
        marginTop: -92,
        alignSelf: 'center',
        width: 120,
        height: 120,
        backgroundColor: '#F6F6F6',
        borderRadius: 16,
    },
    avatarBtn: {
        width: 25,
        height: 25,
        alignSelf: 'center',
        marginTop: -39,
        marginRight: -119.5,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    avatarImg: {
        width: 120,
        height: 120,
        borderRadius: 16,
    },
    addAvatar: {
        backgroundColor: '#fff',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FF6C00',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    delAvatar: {
        backgroundColor: '#fff',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#BDBDBD',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginTop: 46,
        fontSize: 30,
        color: '#000',
        textAlign: 'center',
        fontFamily: "Roboto-Medium",
    },
})