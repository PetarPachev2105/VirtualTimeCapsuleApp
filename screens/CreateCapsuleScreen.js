import React from 'react';
import {View, Text, TextInput, Button, StyleSheet, ScrollView, Image, FlatList} from 'react-native';
import Toast from 'react-native-toast-message';
import * as pako from 'pako';
import { launchImageLibrary } from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../utils/API";
import _ from "lodash";

export default class CreateCapsuleScreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            message: '',
            date: '',
            images: [],
            hasError: false,
        };
    }

    showToast = (type, title, message) => {
        Toast.show({
            type: type ? type : 'success',
            text1: title,
            text2: message
        });
    }
    selectImage__v2 = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            base64: true,
        });

        if (!result.canceled) {
            result.assets.forEach((asset) => {
                const imageUri = `data:image/jpeg;base64,${asset.base64}`;

                const existingImage = this.state.images.find((existingImageObj) => existingImageObj.uri === imageUri);

                if (!existingImage && imageUri) {
                    this.setState({images: [...this.state.images, { uri: imageUri }]});
                }
            });
        }
    }

    deleteImage = (imageUri) => {
        const allImages = Array.from(this.state.images);

        const existingImageIndex = allImages.findIndex((existingImageObj) => existingImageObj.uri === imageUri);

        if (existingImageIndex < 0) {
            return;
        }

        allImages.splice(existingImageIndex, 1);

        this.setState({ images: allImages });
    }

    createCapsule = async () => {
        const payload = {
            title: this.state.title,
            openDate: this.state.date,
            capsuleContent: {
                message: this.state.message,
                images: this.state.images,
            }
        };

        const compressedPayload = pako.gzip(JSON.stringify(payload));

        try {
            const authToken = await AsyncStorage.getItem('token');

            await axios.post(`${API.URL}/insert_capsules/insert_capsules`, compressedPayload, {
                headers: {
                    Authorization: `${authToken}`,
                    'Content-Type': 'application/gzip'
                },
            });
            this.setState({
                title: '',
                message: '',
                date: '',
                images: [],
            });
            this.showToast('success', 'Success', 'Capsule created successfully');
        } catch (error) {
            const errorMessage = _.get(error, 'response.data.message', error.message);
            this.showToast('error', 'Error while loading the capsule', errorMessage);
        }
    };

    render() {
        return (
            <>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.label}>Title:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(title) => { this.setState({ title })}}
                        value={this.state.title}
                    />

                    <Text style={styles.label}>Message:</Text>
                    <TextInput
                        style={[styles.input, { height: 100 }]}
                        onChangeText={(message) => { this.setState({ message })}}
                        value={this.state.message}
                        multiline
                    />

                    <Text style={styles.label}>Open Date:</Text>
                    <TextInput
                        style={styles.input}
                        onChangeText={(date) => { this.setState({ date })}}
                        value={this.state.date}
                        placeholder="YYYY-MM-DD"
                    />

                    {this.state.images && this.state.images.length > 0 && (
                        <FlatList
                            data={this.state.images}
                            keyExtractor={item => item.uri}
                            horizontal={true}
                            contentContainerStyle={styles.flatListContainer}
                            renderItem={({ item }) => (
                                <View style={styles.imageContainer}>
                                    <Image source={{ uri: item.uri }} style={styles.image} onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}  />
                                    <View style={styles.buttonColumn}>
                                        <Button title="Remove" onPress={() => this.deleteImage(item.uri)} color="#ff6347" />
                                    </View>
                                </View>
                            )}
                        />
                    )}


                    <View style={styles.buttonContainer}>
                        <Button title="Select Image" onPress={async () => { await this.selectImage__v2(); }} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <Button title="Create Capsule" onPress={async () => await this.createCapsule()} />
                    </View>
                </ScrollView>
                <Toast />
            </>
        );
    }
}

const styles = StyleSheet.create({
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
        marginVertical: 10,
    },

    flatListContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    buttonColumn: {
        marginTop: 5,
    },
});
