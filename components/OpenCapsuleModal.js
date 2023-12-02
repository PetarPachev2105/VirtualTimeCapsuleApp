import React from 'react';
import {Modal, View, Button, StyleSheet, Text, Image, FlatList} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../utils/API";
import _ from "lodash";
import Toast from "react-native-toast-message";
import LoadingAnimation from "./LoadingAnimation";

class DeleteCapsuleModal extends React.Component {
    constructor(props) {
        super(props);

        this.parentFunctions = {
            onClose: props.onClose,
            onDelete: props.onDelete,
        };

        this.state = {
            capsule: props.capsule,
            capsuleContent: null,
            capsuleContentLoaded: false,
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

    loadCapsuleContent = async () => {
        try {
            const authToken = await AsyncStorage.getItem('token');

            const response = await axios.get(`${API.URL}/capsule_contents/get_capsule_contents/${this.state.capsule.id}`, {
                headers: {
                    Authorization: `${authToken}`,
                },
            });

            const capsuleContents = _.get(response, 'data.capsuleContents', []);

            let message = '';
            let images = [];

            const messageContent = capsuleContents.find(capsuleContent => capsuleContent.type === 'text');

            message = _.get(messageContent, 'content.message', 'No message');

            const imageContents = capsuleContents.filter(capsuleContents => capsuleContents.type === 'image');

            images = imageContents.map(content => content.content);

            this.setState({
                message,
                images,
                capsuleContentLoaded: true,
            });
        } catch (err) {
            const errorMessage = _.get(err, 'response.data.message', err.message);
            this.showToast('error', 'Error while loading the capsule', errorMessage);
        }
    }

    async componentDidMount() {
        await this.loadCapsuleContent();
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
                        <Text> Welcome back to the past </Text>
                        {!this.state.capsuleContentLoaded && <LoadingAnimation size="large" color="#00ff00" />}
                        {this.state.capsuleContentLoaded && <>
                            <Text>
                                Your message: {this.state.message}
                            </Text>

                            {this.state.images && this.state.images.length > 0 && (
                                <FlatList
                                    data={this.state.images}
                                    keyExtractor={item => item.uri}
                                    horizontal={false}
                                    contentContainerStyle={styles.flatListContainer}
                                    renderItem={({ item }) => (
                                        <View style={styles.imageContainer}>
                                            <Image source={{ uri: item.uri }} style={styles.image} onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}  />
                                        </View>
                                    )}
                                />
                            )}
                        </>}


                        <View style={styles.buttonComponents}>
                            <View style={styles.buttonWrapper}>
                                <Button title="Close" onPress={this.parentFunctions.onClose} />
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
    flatListContainer: {
        marginVertical: 5,
    },
    imageContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginVertical: 5
    },
});

export default DeleteCapsuleModal;
