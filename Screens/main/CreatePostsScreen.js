import {
    StyleSheet,
    Keyboard,
    TouchableWithoutFeedback,
    View,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    Button,
    Image
} from "react-native";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Camera, CameraType } from 'expo-camera';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons';

export const CreatePostsScreen = ({ navigation }) => {
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [cameraRef, setCameraRef] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState(null);
    const [coords, setCoords] = useState(null);
    const [country, setCountry] = useState(null);

    const { userId, nickname } = useSelector(state => state.auth);

    useEffect(() => {
        (async () => {
            await Location.requestForegroundPermissionsAsync();
        })();

        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardShown(true);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardShown(false);
        });

        (async () => {
            const location = await Location.getCurrentPositionAsync();
            setCoords(location);
        })();

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const hideKeyboard = () => {
        setIsKeyboardShown(false);
        Keyboard.dismiss();
    };

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
        <View style={styles.container}>
            <Text style={{ textAlign: 'center' }}>
            We need your permission to show the camera
            </Text>
            <Button onPress={requestPermission} title="grant permission" />
        </View>
        );
    }

    const pickImage = async () => {
        try {
            await getAddress();
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
        }
    };   

    const toggleCameraType = () => {
        setType(current =>
        current === CameraType.back ? CameraType.front : CameraType.back
        );
    };

    async function getAddress() {
        try {
            const address = await Location.reverseGeocodeAsync({
                latitude: coords.coords.latitude,
                longitude: coords.coords.longitude,
            });
            setLocation(`${address[0].city}, ${address[0].country}`);
            setCountry(address[0].country);
        } catch (error) {
            console.log(error);
        }
    }

    const takePhoto = async () => {
        try {
            const photo = await cameraRef.takePictureAsync();
            setPhoto(photo.uri);
            getAddress();
        } catch (error) {
            console.log(error);
        }
    };

    const resetPhotoState = () => {
        setPhoto(null);
        setLocation('');
    };

    const uploadPhoto = async () => {
        try {
            // Uploading photo
            const response = await fetch(photo);
            const file = await response.blob();
            await uploadBytes(ref(storage, `photos/${file._data.blobId}`), file);
            // get photo url
            const photoUrl = await getDownloadURL(
                ref(storage, `photos/${file._data.blobId}`)
            );
            return photoUrl;
        } catch (error) {
            console.log(error);
        }
    };

    const uploadPost = async () => {
        try {
            const photo = await uploadPhoto();
            console.log(photo);
            await addDoc(collection(db, 'posts'), {
                userId,
                nickname,
                photo,
                title,
                location,
                coords: coords.coords,
                date: Date.now().toString(),
                country,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const onSubmit = async () => {
        if (photo === null && location === '') {
            Toast.show({
                type: 'error',
                text1: 'There are must be photo and title',
            });
            return;
        }
            await uploadPost();
            navigation.navigate('PostsScreen');
            resetPhotoState();
            setTitle('');
            setLocation('');
    };

    return (
        <TouchableWithoutFeedback onPress={hideKeyboard}>
            <View style={styles.container}>
                <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : ''} >
                    {/* Form container */}
                    <View style={{
                        ...styles.form,
                        paddingBottom: isKeyboardShown ? 0 : 45,
                        marginBottom: isKeyboardShown ? -120 : 0,
                    }}>
                        {/* old Image container (temp) */}
                        {/* <View style={styles.imgContainer}> */}
                            {/* <Image /> */}
                            {/* <Pressable style={styles.addImgBtn}>
                                <AntDesign name="camera" size={24} color="#BDBDBD" />
                            </Pressable>
                        </View>
                        <Pressable>
                            <Text style={styles.addImage}>
                                {photo ? "Загрузите фото" : "Редактировать фото"}
                            </Text>
                        </Pressable> */}

                        {photo ? (
                            <View style={styles.imgContainer}>
                                <Image
                                    style={{
                                        width: '100%',
                                        height: 240,
                                        backgroundColor: '#F6F6F6',
                                        borderRadius: 8,
                                    }}
                                    source={{ uri: photo }}
                                />
                                <Pressable style={styles.addImgBtn} onPress={resetPhotoState}>
                                    <AntDesign name="camera" size={24} color="#BDBDBD" />
                                </Pressable>
                            </View>
                        ) : (
                            <Camera
                                style={styles.camera}
                                type={type}
                                ref={ref => setCameraRef(ref)}
                            >
                                <Pressable style={styles.addImgBtn} onPress={takePhoto}>
                                    <AntDesign name="camera" size={24} color="#BDBDBD" />
                                </Pressable>
                                
                                <View style={{ position: 'absolute', right: 10, bottom: 10 }}>
                                    <TouchableOpacity onPress={toggleCameraType}>
                                        <MaterialIcons
                                            name="flip-camera-android"
                                            size={24}
                                            color="#BDBDBD"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Camera>
                        )}

                        <Pressable onPress={pickImage}>
                            <Text style={styles.addImage}>
                                {photo ? "Загрузите фото" : "Редактировать фото"}
                            </Text>
                        </Pressable>

                        <TextInput
                            value={title}
                            onChangeText={text => setTitle(text)}
                            placeholder="Название..."
                            placeholderTextColor={'#BDBDBD'}
                            style={styles.postTitle}
                        />
                        <TextInput
                            value={location}
                            onChangeText={text => setLocation(text)}
                            placeholder="Местность..."
                            placeholderTextColor={'#BDBDBD'}
                            style={styles.postLocation}
                        />
                        {/* <AntDesign name="enviromento" size={24} color="black" /> */}
                        {/* Кнопка публикации */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.button}
                            onPress={onSubmit}
                        >
                            <Text style={styles.btnTitle}>Опубликовать</Text>
                        </TouchableOpacity>
                        {/* Toolbar */}
                        <Pressable style={styles.deleteBtn}>
                            <AntDesign name="delete" size={24} color="#BDBDBD" />
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        paddingTop: 32,
        paddingBottom: 45,
        paddingHorizontal: 16,
        backgroundColor: '#fff',
    },
    imgContainer: {
        backgroundColor: '#F6F6F6',
        height: 240,
        borderWidth: 1,
        borderColor: '#E8E8E8',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        width: '100%',
        height: 240,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImgBtn: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    addImage: {
        color: '#BDBDBD',
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        paddingTop: 6,
    },
    postTitle: {
        marginTop: 32,
        paddingVertical: 15,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: '#000',
    },
    postLocation: {
        marginTop: 16,
        paddingVertical: 15,
        paddingHorizontal: 0,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        fontFamily: "Roboto-Regular",
        fontSize: 16,
        color: '#000',
    },
    button: {
        backgroundColor: '#FF6C00',
        borderRadius: 100,
        marginTop: 32,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "Roboto-Regular",
    },
    deleteBtn: {
        backgroundColor: '#F6F6F6',
        width: 70,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 120,
    }
})