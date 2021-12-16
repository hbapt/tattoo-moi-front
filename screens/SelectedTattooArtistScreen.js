import React, { useState, useEffect } from "react";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView,
    Linking,
    TouchableOpacity,
    TextInput,
    Modal
} from "react-native";
import { Button } from "react-native-elements";
import { AntDesign, Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import HeaderComponent from "./HeaderComponent";


function SelectedTattooArtistScreen(props) {
    //etats du coeur favoris
    const [tattooLiked, setTattooLiked] = useState(false);
    //etats des modals
    const [overlayVisibleRDV, setOverlayVisibleRDV] = useState(false);
    const [overlayVisibleCoeur, setOverlayVisibleCoeur] = useState(false);
    //etats de connexion
    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [userExists, setUserExists] = useState(false);
    //erreur envoyée par le back
    const [listErrorsSignin, setErrorsSignin] = useState([]);

    // récupère les tatoueurs en favoris dans la base de donnée pour avoir les coeurs rouge au chargement de la page
    useEffect(() => {
        console.log("Favoris is loaded");
        const findFavorites = async () => {
            const dataFavorites = await fetch(
                `https://tattoomoibackend.herokuapp.com/favorites?token=${props.dataUser.token}`
            );
            const body = await dataFavorites.json();

            if (body.user.tattooId.find(el => el._id == props.selectedArtistInfos._id)) {
                setTattooLiked(true);
            }
        };

        findFavorites();
    }, []);


    var handleSubmitSignin = async () => {
        const data = await fetch("https://tattoomoibackend.herokuapp.com/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `userEmailFromFront=${signInEmail}&userPasswordFromFront=${signInPassword}`,
        });

        const body = await data.json();

        if (body.result == true) {
            props.addDataUser(body.user);
            AsyncStorage.setItem("dataUserToken", body.token);
            setUserExists(true);

            if (!userExists) {
                return setOverlayVisibleCoeur(false);
            }
        } else {
            setErrorsSignin(body.error);
        }
    };

    var tabErrorsSignin = listErrorsSignin.map((error, i) => {
        return (
            <Text style={{ textAlign: "center", color: "#BF5F5F" }}>{error}</Text>
        );
    });

    var changeFavorites = (tattooId) => {
        if (tattooLiked) {
            handlePressDeleteFavorite(tattooId);
        } else {
            handlePressAddFavorite(tattooId);
        }
    }

    var handlePressAddFavorite = async (id) => {
        setTattooLiked(true);

        const response = await fetch("https://tattoomoibackend.herokuapp.com/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `IdFromFront=${id}&token=${props.dataUser.token}`,
        });

        const addLike = await response.json();
        console.log("AJOUT LIKE HANDLE PRESS", addLike.tattoo);
    };

    var handlePressDeleteFavorite = async (id) => {
        setTattooLiked(false);

        const response = await fetch("https://tattoomoibackend.herokuapp.com/delete-favorites", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `tattooIdFromFront=${id}&token=${props.dataUser.token}`,
        });
        const deleteLike = await response.json();
    };

    const handlePressRDV = () => {
        setOverlayVisibleRDV(!overlayVisibleRDV);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <HeaderComponent navigation={props.navigation} />
            </View>

            <ScrollView contentContainerStyle={{ alignItems: "center" }}>
                <View style={{ alignItems: "center" }}>
                    <Image

                        source={{ uri: props.selectedArtistInfos.profilePicture }}
                        style={styles.imgTatoueur}
                    />

                    <Text

                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            color: "#454543",
                            marginTop: 10,
                        }}
                    >
                        {props.selectedArtistInfos.firstName}
                    </Text>
                    {props.selectedArtistInfos.tattooShopAddress.map((address, i) => {
                        return (
                            <Text key={i}
                                style={{
                                    fontSize: 14,
                                    marginBottom: 20,
                                    fontWeight: "bold",
                                    color: "#454543",
                                }}
                            >
                                {address.tattooShop}
                            </Text>
                        );
                    })}
                    {props.dataUser == null ? (
                        <TouchableOpacity
                            onPress={() => setOverlayVisibleCoeur(true)}
                            style={{ marginTop: -60, marginLeft: 180 }}
                        >
                            <Text>
                                <AntDesign name="heart" size={30} style={{ color: "#454543" }} />
                            </Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                changeFavorites(props.selectedArtistInfos._id)
                            }
                            style={{ marginTop: -60, marginLeft: 180 }}
                        >
                            <Text>
                                <AntDesign name="heart" size={30} style={{ color: tattooLiked ? "#BF5F5F" : "#454543" }} />
                            </Text>
                        </TouchableOpacity>
                    )}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={overlayVisibleCoeur}
                        onRequestClose={() => {
                            setOverlayVisibleCoeur(!overlayVisibleCoeur);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.textOverlay}>Mettre en favoris</Text>
                                <View style={styles.continuer}>
                                    <Button
                                        title="Continuer sans s'inscrire"
                                        titleStyle={{ fontSize: 14 }}
                                        buttonStyle={styles.greenButton}
                                        type="solid"
                                        onPress={() => setOverlayVisibleCoeur(false)}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Adresse email"
                                    onChangeText={setSignInEmail}
                                    value={signInEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mot de passe"
                                    onChangeText={setSignInPassword}
                                    value={signInPassword}
                                    secureTextEntry
                                />
                                {tabErrorsSignin}
                                <Button
                                    title="Se connecter"
                                    titleStyle={{ fontSize: 14 }}
                                    buttonStyle={styles.greenButton}
                                    type="solid"
                                    onPress={() => handleSubmitSignin()}
                                />
                                <View style={styles.inscription}>
                                    <Button
                                        title="S'inscrire"
                                        titleStyle={{ fontSize: 14 }}
                                        buttonStyle={styles.greenButton}
                                        type="solid"
                                        onPress={() => {
                                            setOverlayVisibleCoeur(false),
                                                props.navigation.navigate("Inscription");
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>

                    <View style={{ alignItems: "center" }}>
                        {props.selectedArtistInfos.tattooShopAddress.map((address, i) => {
                            return (
                                <Text key={i}

                                    style={{ fontSize: 18, color: "#454543", marginTop: 20 }}
                                >
                                    {address.address} {address.postalCode} {address.city}
                                </Text>
                            );
                        })}
                        <Text

                            style={{ fontSize: 18, paddingTop: 5, color: "#454543" }}
                        >
                            Temps d'attente:{" "}
                            <Text style={{ fontWeight: "bold" }}>
                                {props.selectedArtistInfos.schedule}
                            </Text>
                        </Text>
                    </View>
                </View>

                <View style={styles.btnGroup}>
                    {props.selectedArtistInfos.styleList.map((style, i) => {
                        return (
                            <Button
                                key={i}
                                title={`#${style}`}
                                type="solid"
                                buttonStyle={styles.button}
                                titleStyle={{
                                    color: "#C2A77D",
                                    fontSize: 14,
                                    fontWeight: "bold",
                                }}
                            />
                        );
                    })}
                </View>

                <View style={styles.ig}>
                    <FontAwesome5
                        name="camera-retro"
                        size={20}
                        color="#454543"
                        style={{ marginRight: 5, marginTop: 5 }}
                    />
                    <Text
                        style={{
                            fontSize: 20,
                            fontWeight: "bold",
                            textAlign: "left",
                            marginTop: 3,
                            color: "#454543",
                        }}
                    >
                        Galerie
                    </Text>
                </View>
                <View

                    style={{
                        width: "100%",
                        marginVertical: 10,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        flexWrap: "wrap",
                    }}
                >
                    {props.selectedArtistInfos.galleryPhoto.map((photo, i) => {
                        return (
                            <Image
                                key={i}
                                source={{ uri: photo }}
                                style={{ width: 95, height: 95, margin: 5 }}
                            />
                        );
                    })}
                </View>

                <Button
                    title="En voir plus"
                    onPress={() =>
                        Linking.openURL(
                            `instagram://user?username=${props.selectedArtistInfos.instagram}`
                        )
                    }
                    buttonStyle={{
                        backgroundColor: "#F1EFE5",
                        padding: 2,
                        borderBottomWidth: 1,
                        borderBottomColor: "#454543",
                        marginBottom: 15,
                    }}
                    titleStyle={{ color: "#454543" }}
                    type="solid"
                />

                <View
                    style={{
                        width: "90%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 20,
                    }}
                >
                    <AntDesign
                        onPress={() =>
                            Linking.openURL(`http://${props.selectedArtistInfos.website}`)
                        }
                        name="earth"
                        size={20}
                        color="#454543"
                        style={{ marginRight: 10, marginTop: 3 }}
                    />
                    <Text
                        onPress={() =>
                            Linking.openURL(`http://${props.selectedArtistInfos.website}`)
                        }
                        style={{ marginTop: 3, fontSize: 16 }}
                    >
                        {props.selectedArtistInfos.website}
                    </Text>
                </View>

                <View

                    style={{
                        width: "90%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 10,
                    }}
                >
                    <Feather

                        onPress={() =>
                            Linking.openURL(`tel:${props.selectedArtistInfos.phoneNumber}`)
                        }
                        name="phone"
                        size={20}
                        color="#454543"
                        style={{ marginRight: 10, marginTop: 3 }}
                    />
                    <Text

                        onPress={() =>
                            Linking.openURL(`tel:${props.selectedArtistInfos.phoneNumber}`)
                        }
                        style={{ marginTop: 3, fontSize: 16 }}
                    >
                        {props.selectedArtistInfos.phoneNumber}
                    </Text>
                </View>

                <View

                    style={{
                        width: "90%",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        marginTop: 10,
                    }}
                >
                    <MaterialIcons
                        onPress={() =>
                            Linking.openURL(`mailto:${props.selectedArtistInfos.email}`)
                        }
                        name="alternate-email"
                        size={20}
                        color="#454543"
                        style={{ marginRight: 10, marginTop: 3 }}
                    />
                    <Text

                        onPress={() =>
                            Linking.openURL(`mailto:${props.selectedArtistInfos.email}`)
                        }
                        style={{ marginTop: 3, fontSize: 16 }}
                    >
                        {props.selectedArtistInfos.email}
                    </Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <AntDesign
                        name="facebook-square"
                        onPress={() => Linking.openURL(`https://www.facebook.com/${props.selectedArtistInfos.facebook}`)}
                        size={32}
                        color="#454543"
                        style={{ marginTop: 30, marginRight: 10 }}
                    />
                    <AntDesign

                        name="instagram"
                        onPress={() =>
                            Linking.openURL(
                                `instagram://user?username=${props.selectedArtistInfos.instagram}`
                            )
                        }
                        size={32}
                        color="#454543"
                        style={{ marginTop: 30 }}
                    />
                </View>

                <View style={{ flexDirection: "row", marginBottom: 40 }}>
                    {props.dataUser == null ? (
                        <Button
                            title="Contacter"
                            type="solid"
                            buttonStyle={{
                                backgroundColor: "#C2A77D",
                                marginTop: 40,
                                paddingLeft: 30,
                                paddingRight: 30,
                                paddingTop: 10,
                                paddingBottom: 10,
                                borderRadius: 5
                            }}
                            onPress={() => handlePressRDV()}
                        />
                    ) : (
                        <Button
                            title="Contacter"
                            type="solid"
                            buttonStyle={{
                                backgroundColor: "#C2A77D",
                                marginTop: 40,
                                paddingLeft: 30,
                                paddingRight: 30,
                                paddingTop: 10,
                                paddingBottom: 10,
                                borderRadius: 5
                            }}
                            onPress={() => { props.navigation.navigate("Formulaire") }}
                        />
                    )}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={overlayVisibleRDV}
                        onRequestClose={() => {
                            setOverlayVisibleRDV(!overlayVisibleRDV);
                        }}
                    >
                        <View style={styles.centeredView}>
                            <View style={styles.modalView}>
                                <Text style={styles.textOverlay}>Prendre un RDV</Text>
                                <View style={styles.continuer}>
                                    <Button
                                        title="Continuer sans s'inscrire"
                                        titleStyle={{ fontSize: 14 }}
                                        buttonStyle={styles.greenButton}
                                        type="solid"
                                        onPress={() => {
                                            handlePressRDV(), props.navigation.navigate("Formulaire");
                                        }}
                                    />
                                </View>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Adresse email"
                                    onChangeText={setSignInEmail}
                                    value={signInEmail}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Mot de passe"
                                    onChangeText={setSignInPassword}
                                    value={signInPassword}
                                    secureTextEntry
                                />
                                {tabErrorsSignin}
                                <Button
                                    title="Se connecter"
                                    titleStyle={{ fontSize: 14 }}
                                    buttonStyle={styles.greenButton}
                                    type="solid"
                                    onPress={() => handleSubmitSignin()}
                                />
                                <View style={styles.inscription}>
                                    <Button
                                        title="S'inscrire"
                                        titleStyle={{ fontSize: 14 }}
                                        buttonStyle={styles.greenButton}
                                        type="solid"
                                        onPress={() => {
                                            setOverlayVisibleRDV(false),
                                                props.navigation.navigate("Inscription");
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
            </ScrollView >
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        paddingTop: 50,
        backgroundColor: "#F1EFE5",
        alignItems: "center",
        justifyContent: "center",
    },
    header: {
        maxHeight: 80,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#424D41",
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 5
    },
    btnGroup: {
        marginTop: 20,
        width: "90%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    greenButton: {
        backgroundColor: "#424D41",
        borderRadius: 5,
        alignSelf: "center",
        marginTop: 20,
        marginBottom: 20,
    },
    imgTatoueur: {
        marginTop: 10,
        width: 135,
        height: 135,
        borderRadius: 75,
    },
    ig: {
        flexDirection: "row",
        marginTop: 30,
        width: "90%",
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 300,
        borderRadius: 15,
        textAlign: "center"
    },
    textOverlay: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#424D41",
        textAlign: "center",
        textDecorationLine: "underline",
    },
    continuer: {
        marginTop: 10,
        marginBottom: 10,
    },
    inscription: {
        marginTop: 20,
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
        shadowColor: "#000",
        shadowOffset: {
            width: 10,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
    },
});

function mapStateToProps(state) {
    return {
        selectedArtistInfos: state.selectedArtistInfos,
        dataUser: state.dataUser,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        addDataUser: function (dataUser) {
            dispatch({ type: "addDataUser", dataUser: dataUser });
        },
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SelectedTattooArtistScreen);
