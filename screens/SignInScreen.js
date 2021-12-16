import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView } from 'react-native';
import { Image, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';


function SignInScreen(props) {

    const [signInEmail, setSignInEmail] = useState('');
    const [signInPassword, setSignInPassword] = useState('');

    const [userExists, setUserExists] = useState(false);

    const [listErrorsSignin, setErrorsSignin] = useState([]);

    var handleSubmitSignin = async () => {

        const data = await fetch('https://tattoomoibackend.herokuapp.com/sign-in', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `userEmailFromFront=${signInEmail}&userPasswordFromFront=${signInPassword}`
        })

        const body = await data.json()

        if (body.result == true) {
            props.addDataUser(body.user)
            AsyncStorage.setItem("dataUserToken", body.token);
            setUserExists(true);

            if (!userExists) {
                return (props.navigation.pop())
            }

        } else {
            setErrorsSignin(body.error)
        }
    }

    var tabErrorsSignin = listErrorsSignin.map((error, i) => {
        return (<Text style={{ textAlign: 'center', color: '#BF5F5F' }}>{error}</Text>)
    })


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={require('../assets/tattoo-moi_1.png')}
                    style={{ width: 200, height: 80 }} />
            </View>
            <ScrollView style={styles.scroll}>
                <View style={{ marginBottom: 60 }}>
                    <Button
                        title="Continuer sans s'inscrire"
                        buttonStyle={styles.greenButton}
                        type="solid"
                        onPress={() => props.navigation.pop()}
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
                    buttonStyle={styles.greenButton}
                    type="solid"
                    onPress={() => handleSubmitSignin()}
                />
                {/* 
                <Button
                    title=" Se connecter avec Google"
                    buttonStyle={styles.beigeButton}
                    type="solid"
                    icon={<Ionicons
                        name='logo-google'
                        size={30}
                        color='#F1EFE5'
                    />}
                onPress={() => props.navigation.navigate('Connexion')}
                />
                <Button
                    title=" Se connecter avec Facebook"
                    buttonStyle={styles.beigeButton}
                    type="solid"
                    icon={<FontAwesome
                        name='facebook'
                        size={30}
                        color='#F1EFE5'
                    />}
                onPress={() => props.navigation.navigate('Connexion')}
                /> */}
                <View style={styles.inscription}>
                    <Button
                        title="S'inscrire"
                        buttonStyle={styles.greenButton}
                        type="solid"
                        onPress={() => props.navigation.navigate('Inscription')}
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
        justifyContent: 'center',
    },
    header: {
        maxHeight: 80,
    },
    scroll: {
        flex: 3,
        marginTop: 30,
    },
    greenButton: {
        backgroundColor: '#424D41',
        borderRadius: 5,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    beigeButton: {
        backgroundColor: '#C2A77D',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 30,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: 300,
        borderRadius: 15,
        textAlign: 'center'
    },
    inscription: {
        marginTop: 90,
    },
});

function mapDispatchToProps(dispatch) {
    return {
        addDataUser: function (dataUser) {
            dispatch({ type: 'addDataUser', dataUser: dataUser })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SignInScreen)