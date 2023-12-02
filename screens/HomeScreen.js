import React from 'react';
import { View, Button } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../utils/API";


class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            logout: props.route.params.logout,
        }

        this.navigation = props.navigation;

        this.state = {

        }
    }

    checkIfLogged = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            const response = await axios.get(`${API.URL}/users/get_active_user`, {
                headers: {
                    Authorization: `${authToken}`,
                },
            });

            const user = response.data;

            if (!user) throw new Error('Not logged in')

            setTimeout( async () => {
                await this.checkIfLogged();
            }, 5 * 60 * 1000)
        } catch (e) {
            await this.parentFunctions.logout();
        }
    }

    async componentDidMount() {
        await this.checkIfLogged();
    }

    render() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ margin: 10, width: '80%' }}>
                    <Button
                        title="Check capsules"
                        onPress={() => this.navigation.navigate('Timeline Screen')}
                    />
                </View>
                <View style={{ margin: 10, width: '80%' }}>
                    <Button
                        title="Create a Time Capsule"
                        onPress={() => this.navigation.navigate('Create Capsule')}
                    />
                </View>
                <View style={{ margin: 10, width: '80%' }}>
                    <Button
                        title="Logout"
                        onPress={() => this.parentFunctions.logout()}
                    />
                </View>
            </View>
        );
    }
}

export default HomeScreen;
