import React, { useState } from 'react';
import { View, Button } from 'react-native';
export default function UnauthenticatedHome({ navigation }) {

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ margin: 10, width: '80%' }}>
                <Button
                    title="Login"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
            <View style={{ margin: 10, width: '80%' }}>
                <Button
                    title="Sign Up"
                    onPress={() => navigation.navigate('Sign Up')}
                />
            </View>
        </View>
    );
}
