import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Image, Button } from 'react-native-elements';
import { Dropdown } from 'react-native-element-dropdown';
import { connect } from 'react-redux';
//import * as Facebook from 'expo-facebook';
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
    { label: 'M.', value: 'M.' },
    { label: 'Mme', value: 'Mme' },
    { label: 'NC', value: 'NC' },
];

function SignUpScreen(props) {

    //Const pour le dropdown
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);

    //champs du formulaire
    const [signUpLastName, setSignUpLastName] = useState('');
    const [signUpFirstName, setSignUpFirstName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPhoneNumber, setSignUpPhoneNumber] = useState('');
    const [signUpAddress, setSignUpAddress] = useState('');
    const [signUpPostalCode, setSignUpPostalCode] = useState('');
    const [signUpCity, setSignUpCity] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');
    const [signUpPasswordConfirmation, setSignUpPasswordConfirmation] = useState('');

    //Definir si le user existe et les erreurs appropriées
    const [userExists, setUserExists] = useState(false);
    const [listErrorsSignup, setErrorsSignup] = useState([]);

    //Récupérer les informations de Facebook
    // const [fbLastName, setFbLastName] = useState('');
    // const [fbFirstName, setFbFirstName] = useState('');
    // const [fbEmail, setFbEmail] = useState('');

    //SignUp avec facebook
    // async function FacebookSignUp() {
    //   try {
    //     await Facebook.initializeAsync({appId: '866183567383072'});
    //     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
    //       permissions: ['public_profile', 'email'],
    //     });
    //     if (type === 'success') {
    //       // Get the user's name using Facebook's Graph API
    //       const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
    //       var user = await response.json();
    //       setName(user.name);
    //       setImg({uri: `http://graph.facebook.com/${user.id}/picture`});
    //       AsyncStorage.setItem('name',user.name);
    //       AsyncStorage.setItem('img', `http://graph.facebook.com/${user.id}/picture`);
    //     }
    //   } catch ({ message }) {
    //     alert('Facebook Login Error:', message);
    //   }
    // }


    var handleSubmitSignup = async () => {

        const data = await fetch('https://tattoomoibackend.herokuapp.com/sign-up', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `userGenderFromFront=${value}&userLastNameFromFront=${signUpLastName}&userFirstNameFromFront=${signUpFirstName}&userEmailFromFront=${signUpEmail}&userPhoneNumberFromFront=${signUpPhoneNumber}&userAddressFromFront=${signUpAddress}&userPostalCodeFromFront=${signUpPostalCode}&userCityFromFront=${signUpCity}&userPasswordFromFront=${signUpPassword}&userPasswordConfirmationFromFront=${signUpPasswordConfirmation}`
        })

        const body = await data.json()

        if (body.result == true) {
            props.addDataUser(body.saveClient);
            AsyncStorage.setItem("dataUserToken", body.token);
            setUserExists(true);

            if (!userExists) {
                return (props.navigation.pop(2))
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
                        data={data}
                        dropdownPosition={'bottom'}
                        maxHeight={200}
                        labelField="label"
                        valueField="value"
                        placeholder='Civilité'
                        containerStyle={{ backgroundColor: '#F1EFE5', marginTop: -30 }}
                        activeColor={'#C2A77D'}
                        value={value}
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        onChange={item => {
                            setValue(item.value);
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
                    placeholder="Numéro de téléphone"
                    onChangeText={setSignUpPhoneNumber}
                    value={signUpPhoneNumber}
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
                {tabErrorsSignup}
                <View style={{ flex: 4 }}>

                    <Button
                        title="S'inscrire"
                        buttonStyle={{ backgroundColor: '#424D41', borderRadius: 5, marginTop: 30, alignSelf: 'center', paddingHorizontal: 20 }}
                        type="solid"
                        onPress={() => handleSubmitSignup()}
                    />

                    {/* <Button
                title=" S'inscrire avec Google"
                buttonStyle = {{backgroundColor:'#C2A77D', borderRadius:2, marginBottom: 10, marginTop: 50, alignSelf:'center'}}
                type="solid"
                icon={<Ionicons
                    name='logo-google'
                    size={30}
                    color='#F1EFE5'
                />}
                onPress={() => props.navigation.navigate('Connexion')}
              />
              <Button
                title=" S'inscrire avec Facebook"
                buttonStyle = {{backgroundColor:'#C2A77D', borderRadius:2, alignSelf:'center'}}
                type="solid"
                icon={<FontAwesome
                    name='facebook'
                    size={30}
                    color='#F1EFE5'
                />}
                onPress={() => props.navigation.navigate('Connexion')}
            /> */}
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
        justifyContent: 'center',
    },
    header: {
        maxHeight: 80,
    },
    form: {
        flex: 3,
        marginTop: 40,
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
        width: 300,
        borderRadius: 15,
    },
    smallInput: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 145,
        borderRadius: 15,
    },
    placeholderStyle: {
        fontSize: 14,
        opacity: 0.25
    },
    selectedTextStyle: {
        fontSize: 14
    },
    dropdown: {
        height: 40,
        margin: 5,
        borderWidth: 1,
        padding: 10,
        width: 145,
        borderRadius: 2,
        paddingHorizontal: 8,
        borderRadius: 15
    },
    label: {
        position: 'absolute',
        backgroundColor: '#F1EFE5',
        fontSize: 14,
    },
});

function mapDispatchToProps(dispatch) {
    return {
        addDataUser: function (dataUser) {
            dispatch({ type: 'addDataUser', dataUser: dataUser })
        },
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignUpScreen)