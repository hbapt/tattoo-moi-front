import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeaderComponent from './HeaderComponent';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AccountScreen(props) {

    const handleLogOut = async () => {
        props.disconnectUser(null);
        props.navigation.navigate('Search');
        AsyncStorage.removeItem("dataUserToken");
    } 

    if (props.dataUser !== null) {
        return (
            <View style={styles.container}>
                <HeaderComponent navigation={props.navigation} />

                <SafeAreaView style={styles.safeArea}>
                   
                    <Button
                        titleStyle={styles.titleStyle}
                        buttonStyle={styles.buttonStyle}
                        type="outline"
                        icon={
                            <MaterialCommunityIcons
                                name="calendar-blank-outline"
                                size={20}
                                color="#424D41"
                            />
                        }
                        title="  Mes rendez-vous / devis"
                        onPress={() => props.navigation.navigate('Mes demandes')}
                    />
                    <Button
                        titleStyle={styles.titleStyle}
                        buttonStyle={styles.buttonStyle}
                        type="outline"
                        icon={
                            <MaterialCommunityIcons
                                name="heart-circle"
                                size={20}
                                color="#424D41"
                            />
                        }
                        title="  Mes favoris"
                        onPress={() => props.navigation.navigate('Mes favoris')}
                    />
                    <Button
                        titleStyle={styles.titleStyle}
                        buttonStyle={styles.buttonStyle}
                        type="outline"
                        icon={
                            <MaterialCommunityIcons
                                name="information"
                                size={20}
                                color="#424D41"
                            />
                        }
                        title="  Mes informations personnelles"
                        onPress={() => props.navigation.navigate('Mes infos')}

                    />
               
                </SafeAreaView>
                <View style={styles.deconnexion}>
                    <Button
                        title="Déconnexion"
                        titleStyle={{ color: '#424D41' , fontSize:14}}
                        type="clear"
                        onPress={() => handleLogOut()}
                    />
                </View>
     
            </View>
        )
    } else {
        return (
            <View style={styles.container}>
                <HeaderComponent navigation={props.navigation} />
                <View style={{flex:3, justifyContent:'center', padding:40}}>
                <Text style={{color:'#BF5F5F', textAlign:'center', fontSize:14}}>Veuillez vous inscrire ou vous connecter pour accéder à cette page</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F1EFE5',
        //   alignItems: 'center',
        //   justifyContent: 'center',
    },
    safeArea:{
        marginLeft:30,
        marginRight:30,
        marginBottom:30,
        marginTop:90
    },
    titleStyle: {
        color: '#424D41',
        fontSize:14
    },
    buttonStyle: {
        borderColor: '#424D41', 
        marginBottom:20,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderRadius: 5
    },
    deconnexion: {
        flex:4,
        justifyContent: 'flex-end',
        paddingBottom: 30
    },
    
});

function mapStateToProps(state) {
    return { dataUser: state.dataUser, formList: state.formList}
}

function mapDispatchToProps(dispatch) {
    return {
        disconnectUser: function (dataUser) {
            dispatch({ type: 'disconnectUser', dataUser: dataUser })
        },
        deconnectForms: function (formList) {
            dispatch({ type: 'deconnectForms', formList: formList })
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountScreen);