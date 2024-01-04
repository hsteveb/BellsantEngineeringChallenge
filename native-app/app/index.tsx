import { Text } from 'react-native';
import { Redirect } from 'expo-router';

const RootScreen = () => {
  return <Redirect href={'/login'} />
}

export default RootScreen;
