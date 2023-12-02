import React, { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import API from '../utils/API';

export default function SignUpScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const route = useRoute();
    const { setToken } = route.params;

    const handleSignup = async () => {
        setErrorMessage('');

        if (!username || !password || !email) {
            setErrorMessage('Username, password and email are required');
            return;
        }

        try {
            const response = await axios.post(`${API.URL}/users/register`, { username, email, password });
            await AsyncStorage.setItem('token', response.data.accessToken);
            await setToken();
        } catch (error) {
            setErrorMessage('Register failed: Invalid credentials');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
            />
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />
            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
            <Button title="Sign up" onPress={async () => { await handleSignup(); }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
