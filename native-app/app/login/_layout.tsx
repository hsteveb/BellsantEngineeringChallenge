import { Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import { useState } from 'react';
import auth from '@react-native-firebase/auth';

export default function StateScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(true);

  const authAction = () => {
    if (login) {
      auth().signInWithEmailAndPassword(email, password)
        .then(() => {
        })
        .catch((e) => {
          console.log(e);
          console.log('broken');
        })
    } else {
      auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          console.log('user created');
        })
        .catch(() => {
          console.log('broken');
        })
    }
  }

  return <View style={styles.container}>
    <TextInput value={email} onChangeText={text => setEmail(text)} style={styles.textInput} placeholder={'Email'} />
    <TextInput value={password} secureTextEntry={true} onChangeText={text => setPassword(text)} style={styles.textInput} placeholder={'Password'} />
    <TouchableHighlight onPress={authAction} style={styles.button}><Text style={styles.buttonText}>{!login ? 'Sign up' : 'Login'}</Text></TouchableHighlight>
    <Pressable onPress={() => setLogin(prev => !prev)}><Text>{login ? 'Sign up' : 'login'}</Text></Pressable>
    <Text style={styles.errorText}></Text>
  </View>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12
  },
  textInput: {
    height: 40,
    borderColor: 'black',
    width: '75%',
    borderWidth: 2,
    borderRadius: 8,
    padding: 4
  },
  button: {
    backgroundColor: 'black',
    width: '50%',
    borderRadius: 20,
    padding: 6
  },
  buttonText: { fontSize: 20, color: 'white', textAlign: 'center', fontWeight: 'bold' },
  errorText: { color: 'red' }
})
