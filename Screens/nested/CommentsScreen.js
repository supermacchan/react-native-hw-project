import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity, 
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
    Image,
    FlatList
} from 'react-native';
import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { AntDesign } from "@expo/vector-icons";
import { SingleComment } from '../../Components/SingleComment';

export const CommentsScreen = ({ navigation, route }) => {
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([]);

    const { avatar, nickname } = useSelector(state => state.auth);
    const { photo, postId } = route.params;

    useEffect(() => {
        navigation.getParent()?.setOptions({
        tabBarStyle: {
            display: "none"
        }
        });
        return () => navigation.getParent()?.setOptions({
        tabBarStyle: {
          paddingTop: 9,
          justifyContent: "center",
          paddingLeft: 82,
          paddingRight: 82,
          paddingBottom: 47,
        }
        });
    }, [navigation]);

    useEffect(() => {
        const q = query(
            collection(db, 'posts', postId, 'comments'),
            orderBy('date')
        );
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const comments = [];
            querySnapshot.forEach(doc => {
                comments.push({ ...doc.data(), id: doc.id });
            });
            setAllComments(comments);
        });

        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardShown(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardShown(false);
        });

        return () => {
            unsubscribe();
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSetComment = text => setComment(text);

    const hideKeyboard = () => {
        setIsKeyboardShown(false);
        Keyboard.dismiss();
    };

    const handleSubmit = async () => {
        if (comment === '') {
            alert('Cannot be empty comment');
            return; 
        }
        const fullDate = commentDayandTime();

        await addDoc(collection(db, 'posts', postId, 'comments'), {
            comment,
            avatar,
            nickname,
            date: Date.now().toString(),
            time: fullDate,
        });
        setComment('');
        setIsKeyboardShown(false);
    };

    return (
        <TouchableWithoutFeedback onPress={hideKeyboard}>
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior={Platform.OS == 'ios' ? 'padding' : ''}
                >
                    {/* Comments section container */}
                    <View style={{
                            ...styles.section,
                            paddingBottom: isKeyboardShown ? 0 : 16,
                            marginBottom: isKeyboardShown ? -120 : 0,
                    }}>
                        {/* Image container */}
                        <View style={styles.imgContainer}>
                            <Image
                                style={styles.image}
                                source={require('../../assets/test-post.jpg')}
                                objectFit='cover'
                            />
                        </View>
                        {/* Comments section */}
                        {/* <SingleComment /> */}
                        <SafeAreaView style={{ flex: 1, marginBottom: 20 }}>
                            <FlatList
                                data={allComments}
                                renderItem={({ item }) => (
                                    <SingleComment
                                        avatar={item.avatar}
                                        comment={item.comment}
                                        nickname={item.nickname}
                                        date={item.time}
                                    />
                                )}
                                keyExtractor={item => item.id}
                            />
                        </SafeAreaView>
                        {/* New comment input */}
                        <TextInput
                            style={{
                                ...styles.input,
                                backgroundColor: isFocused ? '#fff' : '#F6F6F6',
                                borderColor: isFocused ? '#FF6C00' : '#E8E8E8'
                            }}
                                placeholder='Комментировать...'
                                placeholderTextColor='#BDBDBD'
                                onFocus={() => {
                                    setIsFocused(true);
                                    setIsKeyboardShown(true);
                                }}
                                onBlur={() => { setIsFocused(false) }}
                                onChangeText={handleSetComment}
                                value={inputValue}
                        />
                        {/* Кнопка регистрации */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.button}
                            onPress={handleSubmit}
                        >
                            <AntDesign name="arrowup" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    section: {
        paddingTop: 32,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
    },
    imgContainer: {
        marginTop: 32,
        marginBottom: 32,
        height: 240,
        backgroundColor: '#E8E8E8',
        borderRadius: 8
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 8
    },
    input: {
        // position: 'absolute',
        // bottom: 0,
        // left: 0,
        marginTop: 16,
        paddingHorizontal: 16,
        backgroundColor: '#F6F6F6',
        height: 50,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 100,
        color: "#212121",
        fontSize: 16,
        fontFamily: "Roboto-Regular",
    },
    button: {
        backgroundColor: '#FF6C00',
        width: 34,
        height: 34,
        borderRadius: 17,
        marginTop: -42,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
})