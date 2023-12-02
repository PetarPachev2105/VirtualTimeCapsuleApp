import React from 'react';
import { Modal, View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../utils/API";
import Toast from "react-native-toast-message";
import _ from "lodash";

class DeleteCapsuleModal extends React.Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            onClose: props.onClose,
            onDelete: props.onDelete,
        };

        this.state = {
            capsule: props.capsule,
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

    handleDelete = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            await axios.post(`${API.URL}/capsules/delete_capsule/${this.state.capsule.id}`, {},  {
                headers: {
                    Authorization: `${authToken}`,
                },
            });

            this.showToast('success', 'Success', 'Successfully deleted the capsule');
            this.parentFunctions.onDelete(this.state.capsule.id);
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
                        <Text> Are you sure you want to delete {this.state.capsule.title} </Text>
                        <View style={styles.buttonComponents}>
                            <View style={styles.buttonWrapper}>
                                <Button title="Cancel" onPress={this.parentFunctions.onClose} />
                            </View>
                            <View style={styles.buttonWrapper}>
                                <Button title="Delete" onPress={async () => { await this.handleDelete(); }} />
                            </View>
                        </View>
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
    buttonComponents: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    buttonWrapper: {
        marginHorizontal: 5,
    },
});

export default DeleteCapsuleModal;
