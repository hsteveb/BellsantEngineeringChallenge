import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Redirect, Tabs } from 'expo-router';
import { Button, Pressable, useColorScheme } from 'react-native';

import Colors from '../../constants/Colors';
import auth from '@react-native-firebase/auth';
import { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { useAuthContext } from '../../components/AuthProvider';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{marginBottom: -3}} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const logoutAction = () => {
    auth().signOut();
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: 'Machine State',
          tabBarIcon: ({color}) => <TabBarIcon name='list-ul' color={color} />,
          headerRight: () => <Button onPress={logoutAction} title={'Sign Out'} />
        }}
      />
      <Tabs.Screen
        name='two'
        options={{
          title: 'Log Part',
          tabBarIcon: ({color}) => <TabBarIcon name='edit' color={color} />,
        }}
      />
    </Tabs>
  );
}
