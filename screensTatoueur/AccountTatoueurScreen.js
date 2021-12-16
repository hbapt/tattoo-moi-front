import React from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeaderComponent from '../screens/HeaderComponent';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

function AccountTatoueurScreen(props) {
    
    const handleLogOut = async () => {
        props.disconnectTattoo(null);
        //props.deconnectForms(formList);
        props.navigation.navigate('TabBottomClient', {screen:'Search'});
        AsyncStorage.removeItem("dataTattooToken");
    } 

        return (
            <View style={styles.container}>
                <HeaderComponent  />
            
                <SafeAreaView style={styles.safeArea}>
                   
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
                       onPress={() => props.navigation.navigate('Infos')}

                   />
                   
                   <Button
                       titleStyle={styles.titleStyle}
                       buttonStyle={styles.buttonStyle}
                       type="outline"
                       icon={
                           <MaterialCommunityIcons
                               name="calendar-multiselect"
                               size={20}
                               color="#424D41"
                           />
                       }
                       title="  Mes rendez-vous"
                       onPress={() => props.navigation.navigate('Calendrier')}
                   />
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
                       title="  Mes demandes"
                       onPress={() => props.navigation.navigate('Demandes')}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F1EFE5',
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
        borderRadius:5
    },
    deconnexion: {
        flex:4,
        justifyContent: 'flex-end',
        paddingBottom:30
    },
    
});

function mapStateToProps(state) {
    return { dataTattoo: state.dataTattoo}
}

function mapDispatchToProps(dispatch) {
    return {
        disconnectTattoo: function (dataTattoo) {
            dispatch({ type: 'disconnectTattoo', dataTattoo: dataTattoo })
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
) (AccountTatoueurScreen)