import React from 'react';
import {Modal, View, Button, StyleSheet, Text, TextInput, ScrollView} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../utils/API";
import _ from "lodash";
import Toast from "react-native-toast-message";
// import DateTimePicker from '@react-native-community/datetimepicker';

class EditCapsuleModal extends React.Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            onClose: props.onClose,
            onSave: props.onSave,
        };

        this.state = {
            capsule: props.capsule,
            newTitle: props.capsule.title,
            newDate: props.capsule.open_date,
            isVisible: props.isVisible,
        };
    }

    showToast = (type, title, message) => {
        Toast.show({
            type: type ? type : 'success',
            text1: title,
            text2: message
        });
    }

    handleTitleChange = (title) => {
        this.setState({
            newTitle: title,
        });
    }

    handleDateChange = (date) => {
        this.setState({
            newDate: date,
        });
    }

    handleSave = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            await axios.post(`${API.URL}/capsules/update_capsule/${this.state.capsule.id}`, {
                title: this.state.newTitle,
                open_date: this.state.newDate,
            },  {
                headers: {
                    Authorization: `${authToken}`,
                },
            });

            this.showToast('success', 'Success', 'Successfully deleted the capsule');
            const newCapsule = { ...this.state.capsule, title: this.state.newTitle, open_date: this.state.newDate };

            this.parentFunctions.onSave(newCapsule);
        } catch (error) {
            const errorMessage = _.get(error, 'response.data.message', error.message);
            this.showToast('error', 'Error while loading the capsule', errorMessage);
        }
    }

    render() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isVisible}
                onRequestClose={this.parentFunctions.onClose}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <ScrollView contentContainerStyle={styles.container}>
                            <Text style={styles.label}>Title:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.handleTitleChange}
                                value={this.state.newTitle}
                            />

                            <Text style={styles.label}>Open Date:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={this.handleDateChange}
                                value={this.state.newDate}
                            />

                            <View style={styles.buttonContainer}>
                                <Button title="Edit Capsule" onPress={this.handleSave} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
                <Toast />
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        marginTop: 20,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        padding: 10,
        borderRadius: 5,
    },
    buttonContainer: {
        margin: 10,
    },
});

export default EditCapsuleModal;
