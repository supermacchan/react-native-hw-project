import { createStackNavigator } from '@react-navigation/stack';
import { DefaultPostsScreen } from '../nested/DefaultPostsScreen';
import { MapScreen } from '../nested/MapScreen';
import { CommentsScreen } from '../nested/CommentsScreen';
import { useDispatch } from 'react-redux';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const NestedScreen = createStackNavigator();

export const PostsScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
      <NestedScreen.Navigator
          initialRouteName="Posts"
          screenOptions={{

          }}
      >
      <NestedScreen.Screen
        name="DefaultScreen"
        component={DefaultPostsScreen}
        options={{
          headerTitle: 'Публикации',
          headerTitleStyle: {
            fontSize: 17,
            fontFamily: 'Roboto-Medium',
            color: '#212121',
          },
          headerLeft: false,
          headerRight: () => (
            <Pressable style={{paddingRight: 15}} onPress={() => dispatch(authSingOutUser())}>
              <MaterialIcons name="logout" size={24} color="#BDBDBD" />
            </Pressable>
          ),
          headerStyle: {
            borderBottomWidth: 0.3,
            borderBottomColor: '#B3B3B3',
          },
          headerTitleAlign: 'center',
        }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
            headerTitle: 'Карта',
            headerTitleAlign: 'center'
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
            headerTitle: 'Комментарии',
            headerTitleAlign: 'center',
            }}
      />
    </NestedScreen.Navigator>
  );
};