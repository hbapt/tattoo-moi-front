import React, { useState, useEffect } from 'react';
import { Button, Overlay } from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';

import HeaderComponent from './HeaderComponent';

import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native';
import LottieView from 'lottie-react-native';

import * as Location from 'expo-location';

const tattooStyles = ['old school', 'new school', 'realism', 'japanese', 'tribal', 'fineline', 'dotwork', 'geometric', 'lettering'];

function SearchScreen(props) {

    const [userToken, setUserToken] = useState(false);
    const [selected, setSelected] = useState([]);
    // const [tattooshopName, setTattooshopName] = useState('');
    const [tatoueurName, setTatoueurName] = useState('');
    const [tatoueurCity, setTatoueurCity] = useState('');
    const [tatoueurCityInput, setTatoueurCityInput] = useState('');

    const [displayCurrentAddress, setDisplayCurrentAddress] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    const [visible, setVisible] = useState(false);

    //A l'initialisation de searchScreen, si le user était connecté on remet ses infos dans le store avec une route get
    useEffect(() => {

        CheckIfLocationEnabled();

        setDisplayCurrentAddress('Chercher autour de moi')

        AsyncStorage.getItem("dataUserToken", function (error, data) {

            if (data) {
                const findUser = async () => {
                    const reqFind = await fetch(`https://tattoomoibackend.herokuapp.com/client-data?token=${data}`)
                    const resultFind = await reqFind.json()

                    props.addDataUser(resultFind.client)
                }
                findUser();
                setUserToken(true);
            }
        });

    }, []);

    const CheckIfLocationEnabled = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
        }
    }


    // Position du l'utilisateur
    const GetCurrentLocation = async () => {

        setDisplayCurrentAddress('Chercher autour de moi', setVisible(true))

        let { coords } = await Location.getCurrentPositionAsync();

        props.saveUserPosition({ latitude: coords.latitude, longitude: coords.longitude })

        if (coords) {
            const { latitude, longitude } = coords;
            let response = await Location.reverseGeocodeAsync({
                latitude,
                longitude
            })

            setDisplayCurrentAddress(setVisible(false))

            response.map((item) => {

                let userAddress = `${item.street}, ${item.postalCode} ${item.city}`;

                setDisplayCurrentAddress(userAddress);

                setTatoueurCity(item.city)
            })
        }
        setSelected([])
    };


    const handlePress = async (tattooStyle) => {
        selected.includes(tattooStyle)
            ?
            setSelected(selected.filter(s => s !== tattooStyle))
            :
            setSelected([...selected, tattooStyle]);
    }

    const onSearchStylePress = async () => {

        let rawResponse = await fetch('https://tattoomoibackend.herokuapp.com/search-tattoo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify
                ({
                    styleList: selected,
                    firstName: tatoueurName,
                    city: tatoueurCity,
                    cityInput: tatoueurCityInput
                    // tattooShop: tattooshopName
                })
        });

        let response = await rawResponse.json()

        props.saveTatoueurInfos(response.searchResult)

        if (response.searchResult.length === 0) {
            Alert.alert(
                "Sorry...",
                "Tatoueur non trouvé",
                [
                    { text: "OK", onPress: () => props.navigation.goBack() }
                ]
            );
        }

        setTatoueurName('')
        setTatoueurCity('')
        setTatoueurCityInput('')
        setDisplayCurrentAddress('Chercher autour de moi')

        if (
            tatoueurName.length === 0
            // &&
            // tattooshopName.length === 0
            &&
            tatoueurCityInput.length === 0
            &&
            selected.length === 0
            &&
            tatoueurCity !== 0) {
            props.navigation.navigate('MapScreen')
            setDisplayCurrentAddress('Chercher autour de moi')
        } else {
            props.navigation.navigate('Resultat')
            setTatoueurCity('')
        }

    }

    const tattooStyleBtn = tattooStyles.map((tattooStyle, i) => (

        <TouchableOpacity
            key={i}
            onPress={() => handlePress(tattooStyle)}
            style={[styles.button, { backgroundColor: selected.includes(tattooStyle) ? '#C2A77D' : '#F1EFE5' }]}
        >
            <Text style={[styles.textButton, { color: selected.includes(tattooStyle) ? '#F1EFE5' : '#C2A77D' }]}>
                {tattooStyle}
            </Text>
        </TouchableOpacity>
    ));

    return (
        <View style={styles.container}>
            <HeaderComponent navigation={props.navigation} />
            <View style={styles.form}>

                <TextInput
                    onChangeText={(value) => setTatoueurName(value)}
                    value={tatoueurName}
                    style={styles.input}
                    placeholder="Tatoueur"
                />
                <TextInput
                    onChangeText={(value) => setTatoueurCityInput(value)}
                    value={tatoueurCityInput}
                    style={[styles.input, { marginTop: 10 }]}
                    placeholder="Ville"
                />
                {/* <TextInput
                onChangeText={(value) => setTattooshopName(value)}
                value={tattooshopName}
                style={[styles.input, { marginTop: 10 }]}
                placeholder="TattooShop"
            /> */}
                <Overlay
                    isVisible={visible}
                    overlayStyle={{ backgroundColor: 'rgba(255, 255, 255, 0)', borderRadius: 100, width: 160, height: 160, justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                        style={{ width: 150 }}
                        source={require('../assets/image/loading-square.json')} autoPlay loop
                        imageAssetsFolder
                    />
                </Overlay>

                <View style={styles.btnGroup}>

                    {tattooStyleBtn}

                </View>

                <View style={[styles.main, { marginTop: 20 }]}>
                    <TouchableOpacity
                        onPress={() => GetCurrentLocation()}
                        style={[styles.button, { backgroundColor: '#F1EFE5', width: 'auto', paddingRight: 20, paddingLeft: 20 }]}>
                        <Text style={{ color: '#424D41', fontSize: 15, textAlign: 'center' }}>
                            {displayCurrentAddress}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.main}>
                    <Button
                        title="Rechercher"
                        type="solid"
                        buttonStyle={{ backgroundColor: '#424D41', paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10, marginBottom: 25, borderRadius: 5 }}
                        onPress={() => onSearchStylePress()}
                    />
                </View>

                <Button
                    title="Vous êtes pro ? Cliquez ici"
                    buttonStyle={{ backgroundColor: '#F1EFE5', padding: 1, paddingRight: 5, paddingLeft: 5, borderRadius: 5 }}
                    titleStyle={{ color: '#424D41', marginBottom: 25, fontSize: 15 }}
                    type="solid"
                    onPress={() => props.navigation.navigate('Connexion Tatoueur')}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingTop: 50,
        backgroundColor: '#F1EFE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flex: 2,
        maxHeight: 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginBottom: 30
    },
    main: {
        flex: 3,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        width: 350,
        margin: 12,
        marginTop: 35,
        borderWidth: 0.5,
        padding: 10,
        alignSelf: 'center',
        borderRadius: 15,
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#F1EFE5',
        borderColor: '#454543',
        borderWidth: 0.5,
        borderRadius: 15,
        padding: 10,
        marginBottom: 8,
        width: 110,
        marginHorizontal: 5,
    },
    btnGroup: {
        marginTop: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'stretch',
        flexWrap: 'wrap'
    },
    // button: {
    //     backgroundColor: '#F1EFE5',
    //     borderColor: '#454543',
    //     borderWidth: 0.5,
    //     borderRadius: 15,
    //     padding: 10,
    //     marginBottom: 8,
    //     width: 110,
    // },
    // btnGroup: {
    //     marginTop: 40,
    //     width: '100%',
    //     flexDirection: 'row',
    //     justifyContent: 'space-evenly',
    //     alignItems: 'stretch',
    //     flexWrap: 'wrap'
    // },
    textButton: {
        color: '#C2A77D',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    selectedTextButton: {
        color: '#F1EFE5',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    form: {
        flex: 3,
        marginTop: 20,
    }
});

function mapStateToProps(state) {
    return { dataUser: state.dataUser }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveTatoueurInfos: (infos) => dispatch({ type: 'saveTatoueurInfos', infos: infos }),
        addDataUser: (dataUser) => dispatch({ type: 'addDataUser', dataUser: dataUser }),
        saveUserPosition: (position) => dispatch({ type: 'saveUserPosition', position })
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen)