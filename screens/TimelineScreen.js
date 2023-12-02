import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';

import _ from 'lodash';

import API from '../utils/API';

import EditCapsuleModal from '../components/EditCapsuleModal';
import DeleteCapsuleModal from '../components/DeleteCapsuleModal';
import OpenCapsuleModal from '../components/OpenCapsuleModal';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import LoadingAnimation from "../components/LoadingAnimation";

const testCapsules = [
    { id: '1', title: 'Capsule 1', date: '2025-01-01' },
    { id: '2', title: 'Capsule 2', date: '2021-01-01' },
    { id: '3', title: 'Capsule 3', date: '2025-01-01' },
    { id: '4', title: 'Capsule 4', date: '2025-01-01' },
];

export default class TimelineScreen extends React.Component {
    constructor(props) {
        super(props);

        this.navigation = props.navigation;

        this.state = {
            capsules: [],
            capsulesLoaded: false,
            selectedCapsule: null,
            isEditModalVisible: false,
            isDeleteModalVisible: false,
            isCapsuleModalVisible: false,
        }
    }

    loadCapsules = async () => {
        const authToken = await AsyncStorage.getItem('token');

        const response = await axios.get(`${API.URL}/capsules/get_capsules`, {
            headers: {
                Authorization: `${authToken}`,
            },
        });

        const capsules = _.get(response, 'data.capsules', []);

        this.setState({
            capsules,
            capsulesLoaded: true,
        });
    }

    async componentDidMount() {
        await this.loadCapsules();
    }

    canOpenCapsule = (capsule) => {
        if (!capsule || !capsule.open_date) {
            return false;
        }

        return new Date(capsule.open_date) <= new Date();
    }

    setSelectedCapsule = (capsule) => {
        this.setState({
            selectedCapsule: capsule,
        })
    }

    openEditModal = (capsule) => {
        this.setState({
            selectedCapsule: capsule,
            isEditModalVisible: true,
        });
    }

    closeEditModal = () => {
        this.setState({
            selectedCapsule: null,
            isEditModalVisible: false,
        });
    }

    openDeleteModal = (capsule) => {
        this.setState({
            selectedCapsule: capsule,
            isDeleteModalVisible: true,
        });
    }

    closeDeleteModal = () => {
        this.setState({
            selectedCapsule: null,
            isDeleteModalVisible: false,
        });
    }

    openCapsuleModal = (capsule) => {
        this.setState({
            selectedCapsule: capsule,
            isCapsuleModalVisible: true,
        });
    }

    closeCapsuleModal = () => {
        this.setState({
            selectedCapsule: null,
            isCapsuleModalVisible: false,
        });
    }

    handleSaveCapsule = (updatedCapsule) => {
        // console.log('Updated Capsule:', updatedCapsule);

        const capsules = JSON.parse(JSON.stringify(this.state.capsules));

        const capsule = capsules.find(capsuleObj => capsuleObj.id === updatedCapsule.id);

        capsule.title = updatedCapsule.title;
        capsule.open_date = updatedCapsule.open_date;

        this.setState({
            capsules,
            isEditModalVisible: false,
            selectedCapsule: null,
        });
    };

    handleDeleteCapsule = (deletedCapsuleId) => {
        // console.log('Deleted Capsule Id:', deletedCapsuleId);

        const capsules = JSON.parse(JSON.stringify(this.state.capsules));

        const capsuleIndex = capsules.findIndex(capsuleObj => capsuleObj.id === deletedCapsuleId);

        capsules.splice(capsuleIndex, 1);

        this.setState({
            capsules,
            isDeleteModalVisible: false,
            selectedCapsule: null,
        });
    };


    render() {
        return (
            <>
                {!this.state.capsulesLoaded && <LoadingAnimation size="large" color="#00ff00" />}
                {this.state.capsulesLoaded && this.state.capsules.length > 0 && <FlatList
                    data={this.state.capsules}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.item}>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text>Open Date: {item.open_date}</Text>
                            </View>

                            <View style={styles.buttonColumn}>
                                <Button title="Delete" onPress={() => this.openDeleteModal(item)} color="#ff6347" />
                            </View>
                            <View style={styles.buttonColumn}>
                                <Button title="Open" onPress={() => this.openCapsuleModal(item)} disabled={!this.canOpenCapsule(item)} color="#4682b4"/>
                            </View>
                            <View style={styles.buttonColumn}>
                                <Button title="Edit" onPress={() => this.openEditModal(item)} color="#32cd32" />
                            </View>
                        </View>
                    )}
                />}

                {this.state.capsulesLoaded && (!this.state.capsules || this.state.capsules.length <= 0) && <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text> No capsules available</Text>
                </View>}

                {this.state.selectedCapsule && this.state.isEditModalVisible && (
                    <EditCapsuleModal
                        capsule={this.state.selectedCapsule}
                        isVisible={this.state.isEditModalVisible}
                        onClose={this.closeEditModal}
                        onSave={this.handleSaveCapsule}
                    />
                )}

                {this.state.selectedCapsule && this.state.isDeleteModalVisible && (
                    <DeleteCapsuleModal
                        capsule={this.state.selectedCapsule}
                        isVisible={this.state.isDeleteModalVisible}
                        onClose={this.closeDeleteModal}
                        onDelete={this.handleDeleteCapsule}
                    />
                )}

                {this.state.selectedCapsule && this.state.isCapsuleModalVisible && (
                    <OpenCapsuleModal
                        capsule={this.state.selectedCapsule}
                        isVisible={this.state.isCapsuleModalVisible}
                        onClose={this.closeCapsuleModal}
                    />
                )}
            </>
        )
    }

}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9c2ff',
        padding: 10,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    buttonColumn: {
        marginHorizontal: 5,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});
