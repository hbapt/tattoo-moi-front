import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Image, Button, Overlay } from 'react-native-elements';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const genderData = [
    { label: 'M.', value: 'M.' },
    { label: 'Mme', value: 'Mme' },
    { label: 'NC', value: 'NC' },
];

const styleData = [
    { label: 'Old School', value: 'Old School' },
    { label: 'New School', value: 'New School' },
    { label: 'Realism', value: 'Realism' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Tribal', value: 'Tribal' },
    { label: 'Fineline', value: 'Fineline' },
    { label: 'Dotwork', value: 'Dotwork' },
    { label: 'Geometric', value: 'Geometric' },
    { label: 'Lettering', value: 'Lettering' },
];

const colorData = [
    { label: 'Noir et blanc', value: 'black' },
    { label: 'Couleur', value: 'color' },
]

function SignUpTatoueurScreen(props) {

    //Const pour le dropdown
    const [gender, setGender] = useState(null);
    const [style, setStyle] = useState([]);
    const [isFocus, setIsFocus] = useState(false);

    //champs du formulaire
    const [signUpLastName, setSignUpLastName] = useState('');
    const [signUpFirstName, setSignUpFirstName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpPasswordConfirmation, setSignUpPasswordConfirmation] = useState('');
    const [signUpPhoneNumber, setSignUpPhoneNumber] = useState('');
    const [signUpSiret, setSignUpSiret] = useState('');
    const [schedule, setSchedule] = useState('');
    const [color, setColor] = useState([]);
    const [website, setWebsite] = useState('');
    const [facebook, setFacebook] = useState('');
    const [instagram, setInstagram] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [galleryPhoto, setGalleryPhoto] = useState([]);
    const [tattooShop, setTattooShop] = useState('');
    const [signUpAddress, setSignUpAddress] = useState('');
    const [signUpPostalCode, setSignUpPostalCode] = useState('');
    const [signUpCity, setSignUpCity] = useState('');

    //Definir si le user existe et les erreurs appropriées
    const [userExists, setUserExists] = useState(false);
    const [listErrorsSignup, setErrorsSignup] = useState([]);

    //Etat de l'overlay
    const [visible, setVisible] = useState(false);

    let openImagePickerAsync = async () => {
        setVisible(!visible)
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();
        var data = new FormData();
        data.append('avatar', {
            uri: pickerResult.uri,
            type: 'image/jpeg',
            name: 'avatar.jpg',
        });
        var rawResponse = await fetch('https://tattoomoibackend.herokuapp.com/upload', {
            method: 'POST',
            body: data
        });
        var response = await rawResponse.json();
        setProfilePic(response.url);
        if (response) {
            setVisible(false)
        }
    }

    var handleSubmitSignup = async () => {

        const data = await fetch('https://tattoomoibackend.herokuapp.com/sign-up-tattoo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `genderFromFront=${gender}&lastNameFromFront=${signUpLastName}&firstNameFromFront=${signUpFirstName}&emailFromFront=${signUpEmail}&passwordFromFront=${signUpPassword}&passwordConfirmationFromFront=${signUpPasswordConfirmation}&phoneFromFront=${signUpPhoneNumber}&siretFromFront=${signUpSiret}&scheduleFromFront=${schedule}&styleFromFront=${style}&colorFromFront=${color}&websiteFromFront=${website}&facebookFromFront=${facebook}&instagramFromFront=${instagram}&profilePictureFromFront=${profilePic}&tattooShopFromFront=${tattooShop}&addressFromFront=${signUpAddress}&postalCodeFromFront=${signUpPostalCode}&cityFromFront=${signUpCity}`
        })

        const body = await data.json()
        setProfilePic('')
        if (body.result == true) {
            props.addDataTattoo(body.saveTattoo);
            AsyncStorage.setItem("dataTattooToken", body.token);
            setUserExists(true);

            if (!userExists) {
                return (props.navigation.navigate('TabBottomTattoo', { screen: 'Calendrier' }))
            }

        } else {
            setErrorsSignup(body.error)
        }
    }

    var tabErrorsSignup = listErrorsSignup.map((error, i) => {
        return (<Text style={{ textAlign: 'center', color: '#BF5F5F' }}>{error}</Text>)
    })

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/tattoo-moi_1.png')}
                    style={{ width: 200, height: 80 }} />
            </View>

            <ScrollView style={styles.form}>
                <View style={styles.smallForm}>
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={genderData}
                        dropdownPosition={'bottom'}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder='Civilité'
                        containerStyle={{ backgroundColor: '#F1EFE5', marginTop: -30 }}
                        activeColor={'#C2A77D'}
                        value={gender}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setGender(item.value);
                            setIsFocus(false);
                        }}

                    />
                    <TextInput
                        style={styles.smallInput}
                        placeholder="Nom"
                        onChangeText={setSignUpLastName}
                        value={signUpLastName}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Prénom"
                    onChangeText={setSignUpFirstName}
                    value={signUpFirstName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    onChangeText={setSignUpEmail}
                    value={signUpEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    onChangeText={setSignUpPassword}
                    value={signUpPassword}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirmation mot de passe"
                    onChangeText={setSignUpPasswordConfirmation}
                    value={signUpPasswordConfirmation}
                    secureTextEntry
                />
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de téléphone"
                    onChangeText={setSignUpPhoneNumber}
                    value={signUpPhoneNumber}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Numéro de SIRET"
                    onChangeText={setSignUpSiret}
                    value={signUpSiret}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Temps d'attente"
                    onChangeText={setSchedule}
                    value={schedule}
                />
                <View style={styles.multiselect}>
                    <MultiSelect
                        style={styles.input}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        containerStyle={{ backgroundColor: '#F1EFE5', marginBottom: 40, marginTop: -30 }}
                        search
                        maxHeight={300}
                        data={styleData}
                        labelField="label"
                        valueField="value"
                        placeholder="Style"
                        searchPlaceholder="Chercher..."
                        value={style}
                        onChange={item => {
                            setStyle(item);
                        }}
                        selectedStyle={styles.selectedStyle}
                    />
                </View>
                <View style={styles.multiselect}>
                    <MultiSelect
                        style={styles.input}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        containerStyle={{ backgroundColor: '#F1EFE5', marginBottom: 40, marginTop: -30 }}
                        maxHeight={120}
                        data={colorData}
                        labelField="label"
                        valueField="value"
                        placeholder="Couleur"
                        value={color}
                        onChange={item => {
                            setColor(item);
                        }}
                        selectedStyle={styles.selectedStyle}
                    />
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Site web"
                    onChangeText={setWebsite}
                    value={website}
                />
                <TextInput
                    style={styles.input}
                    placeholder="@ Facebook"
                    onChangeText={setFacebook}
                    value={facebook}

                />
                <TextInput
                    style={styles.input}
                    placeholder="@ Instagram"
                    onChangeText={setInstagram}
                    value={instagram}

                />
                <TextInput
                    style={styles.input}
                    placeholder="Nom du TattooShop"
                    onChangeText={setTattooShop}
                    value={tattooShop}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Adresse postale"
                    onChangeText={setSignUpAddress}
                    value={signUpAddress}
                />
                <View style={styles.smallForm}>
                    <TextInput
                        style={styles.smallInput}
                        placeholder="Code postal"
                        onChangeText={setSignUpPostalCode}
                        value={signUpPostalCode}
                    />
                    <TextInput
                        style={styles.smallInput}
                        placeholder="Ville"
                        onChangeText={setSignUpCity}
                        value={signUpCity}
                    />
                </View>

                <View style={{ flex: 1, flexdirection: "row", alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
                        <TouchableOpacity onPress={openImagePickerAsync} style={{ flexDirection: 'row' }} >
                                <MaterialIcons
                                name="save-alt"
                                size={20}
                                color="#C2A77D" />
                            <Text style={{ color: '#C2A77D', fontWeight: 'bold', paddingTop: 4, marginLeft: 4 }}>
                                Télécharger une photo de profil</Text>
                        </TouchableOpacity>
                    </View>

                <Overlay isVisible={visible} overlayStyle={{ backgroundColor: '#F1EFE5' }}>
                    <Text>Chargement...</Text>
                </Overlay>

                {tabErrorsSignup}
                <View style={{ flex: 4 }}>

                    <Button
                        title="S'inscrire"
                        buttonStyle={{ backgroundColor: '#424D41', borderRadius: 5, marginTop: 30, marginBottom: 30, alignSelf: 'center', paddingHorizontal: 20 }}
                        type="solid"
                        onPress={() => handleSubmitSignup()}
                    />

                </View>
            </ScrollView>
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
        // justifyContent: 'center',
    },
    header: {
        maxHeight: 80,
    },
    form: {
        flex: 3,
        marginTop: 20,
    },
    smallForm: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    input: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 350,
        borderRadius: 15,
    },
    smallInput: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 170,
        borderRadius: 15,
    },
    dropdown: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 170,
        borderRadius: 15,
        paddingHorizontal: 8,
    },
    multiselect: {
        maxWidth: 350,
        justifyContent: 'center',
        marginBottom: 5,
    },
    label: {
        position: 'absolute',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 14,
        opacity: 0.25
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 14,
    },
    selectedStyle: {
        borderRadius: 2,
        maxHeight: 50,
        maxWidth: 200,
    },
});

function mapDispatchToProps(dispatch) {
    return {
        addDataTattoo: function (dataTattoo) {
            dispatch({ type: 'addDataTattoo', dataTattoo: dataTattoo })
        },
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignUpTatoueurScreen)