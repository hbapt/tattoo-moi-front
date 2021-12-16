import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { Card } from "react-native-elements";
import { connect } from "react-redux";
import HeaderComponent from "./HeaderComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";

function AppointmentScreen(props) {
    const [formsList, setFormsList] = useState([]);
    const [formId, setFormId] = useState([]);

    useEffect(() => {
        console.log("App is loaded");

        const findProjectForm = async () => {
            const dataProjectForm = await fetch(
                `https://tattoomoibackend.herokuapp.com/project-form?token=${props.dataUser.token}&tattooIdFromFront=${formId}`
            );
            const body = await dataProjectForm.json();

            props.saveForm(body.user.formId);
            setFormsList(body.user.formId);
        };

        findProjectForm();

    }, []);

    var deleteForm = async (id) => {
        const deleteReq = await fetch("https://tattoomoibackend.herokuapp.com/project-form", {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `formId=${id}&token=${props.dataUser.token}`,
        });
        const newForm = await deleteReq.json();
        //console.log("newForm", newForm)
        setFormsList(newForm.newForm.formId);
        props.deleteForm(id);
    };

    var projectForm = props.formList.map((form, i) => {

        console.log("image", form.confirmationFormSchema[0].status);

        return (
            <Card key={i} containerStyle={styles.cards}>
                <View>
                    <Card.Image source={{ uri: form.projectImg }}>
                        <TouchableOpacity onPress={() => deleteForm(form._id)}>
                            <Text style={{ left: "89%", top: "5%" }}>
                                <MaterialCommunityIcons
                                    name="trash-can"
                                    size={30}
                                    color="#F1EFE5"
                                />
                            </Text>
                        </TouchableOpacity>
                    </Card.Image>
                    <View style={styles.cardDesc}>
                        <Text
                            style={{
                                fontWeight: "bold",
                                paddingTop: 5,
                                color: "#454543",
                            }}
                        >
                            {form.type}: {form.request}
                        </Text>

                        <Text
                            style={{ fontWeight: "bold", paddingBottom: 10, color: "#454543" }}
                        >
                            Tatoueur: {form.tattooProjectId[0].firstName} {form.tattooProjectId[0].lastName}
                        </Text>
                        <Text style={[styles.text, {marginLeft: 15}]}>Style: {form.style}</Text>
                        <Text style={[styles.text, {marginLeft: 15}]}>Zone à tatouer: {form.tattooZone}</Text>
                        <Text style={[styles.text, {marginLeft: 15}]}>
                            Taille: {form.heigth} cm x {form.width} cm
                        </Text>
                        <Text style={[styles.text, {marginLeft: 15}]}>Description: {form.description} </Text>
                        <Text style={[styles.text, {marginLeft: 15}]}>
                            Disponibilité: {form.disponibility}
                        </Text>

                        <Text
                            style={{
                                marginBottom: 10,
                                fontWeight: "bold",
                                paddingTop: 10,
                                color: "#454543",
                            }}
                        >
                            Statut de la demande: {form.confirmationFormSchema[0].status}
                        </Text>
                        <Text>
                            {form.confirmationFormSchema[0].status == "Accepté" ? (
                                <>
                                    <View style={{ maxWidth: 310 }}>
                                        <Text style={{ fontWeight: "bold", color: "#454543" }}>
                                            Proposition du tatoueur:
                                        </Text>
                                        <Text style={[styles.text, {marginLeft: 10}]}>
                                            Date proposée: {form.confirmationFormSchema[0].date}
                                        </Text>
                                        <Text style={[styles.text, {marginLeft: 10}]}>
                                            Prix estimé: {form.confirmationFormSchema[0].price} euro
                                        </Text>
                                        <Text style={[styles.commentText, {marginLeft: 10}]}>
                                            Commentaire: {form.confirmationFormSchema[0].comment}
                                        </Text>
                                        <Text
                                            style={{ marginBottom: 10, fontWeight: "bold", color: "#454543", fontStyle: 'italic' }}
                                        >
                                            Adresse: {
                                                form.tattooProjectId[0].tattooShopAddress[0].address
                                            }, {form.tattooProjectId[0].tattooShopAddress[0].postalCode}{" "}
                                            {form.tattooProjectId[0].tattooShopAddress[0].city}
                                        </Text>
                                    </View>
                                </>
                            ) : null}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    });
    console.log('PROPS FORMIST', props.formList);
    return (
        <View style={styles.container}>
            <HeaderComponent navigation={props.navigation} />

            {
                props.dataUser !== null && props.formList.length !== 0 ? (
                    <ScrollView style={{ width: "90%", flex: 2 }}>{projectForm}</ScrollView>
                ) : (
                    <View style={{ flex: 3, justifyContent: 'center', padding: 40 }}>
                        <Text style={{ color: '#BF5F5F', textAlign: 'center', fontSize: 14 }}>Veuillez vous inscrire ou vous connecter pour accéder à cette page</Text>
                    </View>
                )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: "#F1EFE5",
        alignItems: "center",
        justifyContent: "center",
    },
    cardDesc: {
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: "#F1EFE5",
    },
    cards: {
        padding: 0,
        borderWidth: 0.1,
        borderColor: "#454543",
    },
    text: {
        color: "#454543",
        flexWrap: 'wrap',
        flexShrink: 1
    },
    commentText: {
        flex: 1,
        flexDirection: "row",
        color: "#454543",
        flexShrink: 1,
        flexWrap: 'wrap',

    }
});

function mapStateToProps(state) {
    return { dataUser: state.dataUser, formList: state.formList };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteForm: function (_id) {
            dispatch({
                type: "deleteForm",
                _id: _id,
            });
        },
        saveForm: function (dataSaveForm) {
            dispatch({
                type: "saveForm",
                dataSaveForm: dataSaveForm,
            });
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentScreen);
