import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity, 
    Pressable,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authSignInUser } from '../../redux/auth/operations';
import Toast from 'react-native-toast-message';


export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPassFocused, setIsPassFocused] = useState(false);
    const [isKeyboardShown, setIsKeyboardShown] = useState(false);
    const [isPassShown, setIsPassShown] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardShown(true);
        });
        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardShown(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSetEmail = text => setEmail(text);
    const handleSetPassword = text => setPassword(text);

    const hideKeyboard = () => {
        setIsKeyboardShown(false);
        Keyboard.dismiss();
    };

    const handleFormSubmit = () => {
        if (email === '' && password === '') {
            return Toast.show({ type: 'error', text1: 'Fill in all fields' });
        }
        dispatch(authSignInUser({ email, password }));
        valueReset();
        hideKeyboard();
    };

    const valueReset = () => {
        setEmail('');
        setPassword('');
    };

    return (
        <TouchableWithoutFeedback onPress={hideKeyboard}>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.background}
                    source={require("../../assets/background.jpg")}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS == 'ios' ? 'padding' : ''}
                    >
                        {/* Контейнер формы авторизации */}
                        <View style={{
                            ...styles.form,
                            paddingBottom: isKeyboardShown ? 0 : 45,
                            marginBottom: isKeyboardShown ? -120 : 0,
                        }}>
                            <Text style={styles.title}>Войти</Text>
                            {/* инпут для емейла */}
                            <TextInput
                                style={{
                                    ...styles.input,
                                    backgroundColor: isEmailFocused ? '#fff' : '#E8E8E8',
                                    borderColor: isEmailFocused ? '#FF6C00' : 'transparent'
                                }}
                                placeholder='Адрес электронной почты'
                                placeholderTextColor='#BDBDBD'
                                onFocus={() => {
                                    setIsEmailFocused(true);
                                    setIsKeyboardShown(true);
                                }}
                                onBlur={() => { setIsEmailFocused(false) }}
                                onChangeText={text => handleSetEmail(text)}
                                value={email}
                            />
                            {/* инпут для пароля */}
                            <TextInput
                                style={{
                                    ...styles.input,
                                    backgroundColor: isPassFocused ? '#fff' : '#E8E8E8',
                                    borderColor: isPassFocused ? '#FF6C00' : 'transparent'
                                }}
                                placeholder='Пароль'
                                secureTextEntry={!isPassShown}
                                placeholderTextColor='#BDBDBD'
                                onFocus={() => {
                                    setIsPassFocused(true);
                                    setIsKeyboardShown(true);
                                }}
                                onBlur={() => { setIsPassFocused(false) }}
                                onChangeText={text => handleSetPassword(text)}
                                value={password}
                            />
                            {/* Кнопка показать / скрыть пароль */}
                            <Pressable
                                style={styles.showPass}
                                onPress={() => { setIsPassShown(prevState => !prevState) }}
                            >
                                {isPassShown
                                    ? <Text style={styles.showPassText}>Скрыть</Text>
                                    : <Text style={styles.showPassText}>Показать</Text>
                                } 
                            </Pressable>
                            {/* Кнопка регистрации */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.button}
                                onPress={handleFormSubmit}
                            >
                                <Text style={styles.btnTitle}>Войти</Text>
                            </TouchableOpacity>
                            {/* ссылка перехода на страницу логина */}
                            <Pressable style={styles.authNav} onPress={() => navigation.navigate("Registration")} >
                                <Text style={styles.authNavText}>Нет аккаунта? Зарегистрироваться</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </ImageBackground>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingBottom: 90
    },
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: 'flex-end',
    },
    form: {
        paddingTop: 32,
        paddingBottom: 111,
        paddingHorizontal: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        backgroundColor: '#fff',
    },
    title: {
        marginBottom: 32,
        marginTop: 0,
        fontSize: 30,
        color: '#000',
        textAlign: 'center',
        fontFamily: "Roboto-Medium",
    },
    input: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: '#E8E8E8',
        height: 50,
        borderRadius: 8,
        color: "#212121",
        borderWidth: 1,
        borderColor: 'transparent',
        fontSize: 16,
        fontFamily: "Roboto-Regular",
    },
    showPass: {
        alignSelf: 'flex-end',
        marginTop: -50,
        marginRight: 16,
    },
    showPassText: {
        fontSize: 16,
        fontFamily: "Roboto-Regular",
        color: '#1B4371',
    },
    button: {
        backgroundColor: '#FF6C00',
        borderRadius: 100,
        marginTop: 59,
        marginBottom: 16,
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTitle: {
        color: '#fff',
        fontSize: 16,
        fontFamily: "Roboto-Regular",
    },
    authNav: {
        textAlign: 'center',
    },
    authNavText: {
        color: '#1B4371',
        fontSize: 16,
        alignSelf: 'center',
        fontFamily: "Roboto-Regular",
    }
})