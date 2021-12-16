import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    Image,
    Modal,
} from "react-native";
import { ListItem, Button } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { connect } from "react-redux";

function CalendarScreen(props) {
    const [userToken, setUserToken] = useState(false);
    const [tattooData, setTattooData] = useState([]);
    const [form, setForm] = useState([])
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        //A l'initialisation de calendarScreen, si le user était connecté on remet ses infos dans le store avec une route get
        AsyncStorage.getItem("dataTattooToken", function (error, data) {
            if (data) {
                const findUser = async () => {
                    const reqFind = await fetch(
                        `https://tattoomoibackend.herokuapp.com/tattoo-data?token=${data}`
                    );
                    const resultFind = await reqFind.json();

                    props.addDataTattoo(resultFind.tatoueur);
                    setTattooData(resultFind.tatoueur);
                };
                findUser();
                setUserToken(true);
            }
        });
    }, []);

    useEffect(() => {

        console.log("Appoint loaded");

        const findFormTattoo = async () => {
            const dataForm = await fetch(`https://tattoomoibackend.herokuapp.com/appointment-tattoo?id=${props.dataTattoo._id}`)
            const body = await dataForm.json();

            props.saveForm(body.form)
            setForm(body.form)

        }
        findFormTattoo()
    }, [])


    var appointment = props.formList.map((form, i) => {
        console.log("image", form._id)
        if (form.confirmationFormSchema[0].status == "Accepté") {
            return (
                <ListItem
                    key={i}
                    bottomDivider
                    containerStyle={{
                        backgroundColor: "#F1EFE5",
                        paddingTop: 15,
                        borderColor: "#C2A77D",
                    }}
                    onPress={() => {
                        props.saveFormId(form), setModalVisible(true)
                    }}
                >
                    <Ionicons
                        name="md-person-circle-outline"
                        size={30}
                        color="#424D41"
                    />
                    <ListItem.Content>
                        <ListItem.Title
                            style={{ fontSize: 16, color: "#454543", fontWeight: "bold" }}
                        >
                            {form.confirmationFormSchema[0].date}
                        </ListItem.Title>
                        <ListItem.Subtitle style={{ fontSize: 14, color: "#454543" }}>
                            {form.firstName}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron size={20} color="#424D41" />
                </ListItem>
            )
        }
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require("../assets/tattoo-moi_1.png")}
                    style={{ width: 200, height: 80 }}
                />
            </View>
            <ScrollView>
                <View style={styles.profile}>
                    <Image
                        source={{ uri: props.dataTattoo.profilePicture }}
                        style={styles.imgTatoueur}
                    />
                    <Text style={styles.titre}>Salut {props.dataTattoo.firstName} !</Text>
                </View>
                <View>
                    {appointment}
                </View>
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.titleModal}>Rendez-vous avec {props.formId.firstName}</Text>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                            <Text style={styles.textModal}>Zone à tatoueur : </Text>
                            <Text style={styles.textPropsModal}>{props.formId.tattooZone}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                            <Text style={styles.textModal}>Style : </Text>
                            <Text style={styles.textPropsModal}>{props.formId.style}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                            <Text style={styles.textModal}>Hauteur : </Text>
                            <Text style={styles.textPropsModal}>{props.formId.heigth}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                            <Text style={styles.textModal}>Largeur : </Text>
                            <Text style={styles.textPropsModal}>{props.formId.width}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                            <Text style={styles.textModal}>Description : </Text>
                            <Text style={styles.textPropsModal}>{props.formId.description}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignSelf: 'flex-start', flexWrap: 'wrap' }}>
                            <Text style={styles.textModal}>Idée :</Text>
                        </View>
                        <Image
                            source={{ uri: props.formId.projectImg }}
                            style={styles.imgModal}
                        />

                        <Button
                            title="Fermer"
                            titleStyle={{ fontSize: 14 }}
                            buttonStyle={styles.greenButton}
                            type="solid"
                            onPress={() => setModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#F1EFE5",
    },
    header: {
        maxHeight: 80,
        alignSelf: "center",
        //marginBottom:10,
    },
    profile: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        marginVertical: 20,
    },
    imgTatoueur: {
        width: 120,
        height: 120,
        borderRadius: 75,
    },
    titre: {
        marginLeft: -90,
        fontSize: 14,
        fontWeight: "bold",
        color: "#454543",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 300,
        borderRadius: 2,
    },
    greenButton: {
        backgroundColor: "#424D41",
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 20
    },
    titleModal: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#424D41",
        alignSelf: "center",
        textDecorationLine: "underline",
        marginTop: 5,
        marginBottom: 15,
    },
    textModal: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#424D41",
        marginBottom: 5,
    },
    textPropsModal: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#C2A77D",
        marginBottom: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: "#F1EFE5",
        borderRadius: 2,
        padding: 15,
        alignItems: "center",
        shadowColor: "#424D41",
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 10,
    },
    imgModal: {
        width: 300,
        height: 200,
        alignSelf: 'center'
    },
});

function mapStateToProps(state) {
    return { dataTattoo: state.dataTattoo, formId: state.formId, formList: state.formList };
}

function mapDispatchToProps(dispatch) {
    return {
        addDataTattoo: function (dataTattoo) {
            dispatch({ type: "addDataTattoo", dataTattoo: dataTattoo });
        },
        saveFormId: function (formId) {
            dispatch({
                type: 'saveFormId',
                formId
            })
        },
        saveForm: function (dataSaveForm) {
            dispatch({
                type: 'saveForm',
                dataSaveForm: dataSaveForm
            })
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CalendarScreen);
