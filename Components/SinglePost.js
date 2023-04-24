import {
    StyleSheet,
    View,
    Text,
    Image,
    Pressable
} from 'react-native';
import { useState, useEffect } from "react";
import {
  collection,
  getCountFromServer,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { EvilIcons } from '@expo/vector-icons'; 
import { AntDesign } from '@expo/vector-icons';

export const SinglePost = ({ navigation, photo, title, location, coords, postId, likes, country }) => {
    const [count, setCount] = useState(null);
    const [isLike, setIsLike] = useState(false);

    const getCommentsCount = async () => {
      try {
        const coll = collection(db, "posts", postId, "comments");
        const snapshot = await getCountFromServer(coll);
        setCount(snapshot.data().count);
      } catch (error) {
        console.log(error);
      }
    };

    useEffect(() => {
      getCommentsCount();
    }, []);

    const onLike = async () => {
      setIsLike(!isLike);

      if (isLike) {
        await updateDoc(doc(db, "posts", postId), {
          like: likes - 1,
        });
        return;
      }
      await updateDoc(doc(db, "posts", postId), {
        like: likes ? likes + 1 : 1,
      });
      return;
    };

    return (
      <View style={styles.post}>
        {/* Image container */}
        <View style={styles.imgContainer}>
          <Image
            style={styles.image}
            source={{ uri: photo }}
            // source={require('../assets/test-post.jpg')}
            objectFit="cover"
          />
        </View>
        {/* Image title */}
        <Text style={styles.title}>{title}</Text>
        {/* Comments-Location section */}
        <View style={styles.links}>
          {/* Comments Button */}
          <Pressable
            style={styles.commentsBtn}
            onPress={() => navigation.navigate("Comments", { photo, postId })}
          >
            <EvilIcons name="comment" size={24} color="#BDBDBD" />
            <Text style={styles.comments}>{count}</Text>
          </Pressable>
          {/* Likes Button */}
          <Pressable
            onPress={onLike}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 24,
            }}
          >
            {isLike ? (
              <AntDesign name="like1" size={24} color="#FF6C00" />
            ) : (
              <AntDesign name="like2" size={24} color="#FF6C00" />
            )}
            <Text style={styles.quantity}> {likes ? likes : 0}</Text>
          </Pressable>
          {/* Location Button */}
          <Pressable
            style={styles.locationBtn}
            onPress={() =>
              navigation.navigate("Map", { coords, title, location })
            }
          >
            <AntDesign name="enviromento" size={24} color="#BDBDBD" />
            <Text style={styles.location}>{country}</Text>
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