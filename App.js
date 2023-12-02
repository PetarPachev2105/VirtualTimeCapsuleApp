import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import CreateCapsuleScreen from './screens/CreateCapsuleScreen';
import TimelineScreen from './screens/TimelineScreen';
import LoginScreen from './screens/LoginScreen';
import UnauthenticatedHome from './screens/UnauthenticatedHome';
import SignUpScreen from './screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
    constructor() {
        super();

        this.state = {
            loading: true,
            hasError: false,
            authToken: null,
        };
    }

    setToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');
            this.setState({
                authToken,
                loading: false,
            });
        } catch (err) {
            this.setState({
                hasError: true,
                loading: false,
            });
        }
    }

    logout = async () => {
        await AsyncStorage.removeItem('token');
        this.setState({
            authToken: null,
        });
    }

    async componentDidMount() {
        await this.setToken();
    }

    render() {
        return (
            <>
                {this.state.authToken && <NavigationContainer>
                    <Stack.Navigator initialRouteName='Home'>
                        <Stack.Screen name='Home' initialParams={{ logout: this.logout }} component={HomeScreen} />
                        <Stack.Screen name='Create Capsule' component={CreateCapsuleScreen} />
                        <Stack.Screen name='Timeline Screen' component={TimelineScreen} />
                    </Stack.Navigator>
                </NavigationContainer>}
                {!this.state.loading && !this.state.authToken && <NavigationContainer>
                    <Stack.Navigator initialRouteName='Home'>
                        <Stack.Screen name='Welcome Screen' component={UnauthenticatedHome} />
                        <Stack.Screen name='Login' component={LoginScreen} initialParams={{ setToken: this.setToken }} />
                        <Stack.Screen name='Sign Up' component={SignUpScreen} initialParams={{ setToken: this.setToken }} />
                    </Stack.Navigator>
                </NavigationContainer>}
            </>
        )
    }
}
