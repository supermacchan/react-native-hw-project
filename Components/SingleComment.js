import {
    Image,
    StyleSheet, 
    Text,
    View
} from 'react-native';
import { useSelector } from 'react-redux';

export const SingleComment = ({ avatar, comment, nickname, date }) => {
    const username = useSelector(state => state.auth.nickname);

    return (
        <View>
            <View
                style={{
                    ...styles.container,
                    flexDirection: username === nickname ? 'row-reverse' : 'row',
                    marginBottom: 24,
                }}
            >
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                </View>
                    
                <View style={username === nickname ? styles.userComment : styles.comment} >
                    <Text style={styles.text}>{comment}</Text>
                    <Text
                        style={{
                            ...styles.date,
                            textAlign: username === nickname ? 'left' : 'right',
                        }}
                    >
                        {date}
                    </Text>
                </View>
            </View>

            {/* comment 2 */}
            {/* <View
                style={{
                    ...styles.container,
                    flexDirection: 'row-reverse',
                    marginBottom: 24,
                }}
            >
                <View style={styles.avatarContainer}>
                    <Image style={styles.avatar} />
                </View>
                
                <View style={styles.comment}>
                <Text style={styles.text}>Comment pipipipipi</Text>
                <Text
                    style={{
                    ...styles.date,
                    textAlign: 'left',
                    }}
                >
                    10 July 2020
                </Text>
                </View>
            </View> */}
      </View>
  );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    avatarContainer: {
        height: 28,
        width: 28,
        borderRadius: 14,
        backgroundColor: '#FF6C00',
        },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 14,
        },
    comment: {
        flex: 1,
        marginRight: 16,
        padding: 16,

        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderTopLeftRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    userComment: {
        flex: 1, 
        marginLeft: 16,
        padding: 16,

        borderBottomLeftRadius: 6,
        borderBottomRightRadius: 6,
        borderTopRightRadius: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    text: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        color: '#212121',
    },
    date: {
        marginTop: 8,
        fontFamily: 'Roboto-Regular',
        fontSize: 10,
        color: '#BDBDBD',
    },
});