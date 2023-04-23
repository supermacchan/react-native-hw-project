import { createStackNavigator } from '@react-navigation/stack';
import { DefaultProfileScreen } from '../nested/DefaultProfileScreen';
import { MapScreen } from '../nested/MapScreen';
import { CommentsScreen } from '../nested/CommentsScreen';

const NestedScreen = createStackNavigator();

export const ProfileScreen = () => {
  return (
    <NestedScreen.Navigator initialRouteName="DefaultProfile">
      <NestedScreen.Screen
        name="DefaultProfile"
        component={DefaultProfileScreen}
        options={{ headerShown: false }}
      />
      <NestedScreen.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerTitle: 'Карта',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
        }}
      />
      <NestedScreen.Screen
        name="Comments"
        component={CommentsScreen}
        options={{
          headerTitle: 'Комментарии',
          headerTitleAlign: 'center',
          headerLeftLabelVisible: false,
        }}
      />
    </NestedScreen.Navigator>
  );
};
