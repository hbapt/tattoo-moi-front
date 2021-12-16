import React from 'react';
import { StyleSheet , Text, View } from 'react-native';

import {connect} from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';

import HeaderComponent from './HeaderComponent';

function ClientInfoScreen(props) {

    return (
        <View style={styles.container}>
        <HeaderComponent navigation={props.navigation}/>
    
        <View style={styles.main}>
            <Text style={styles.titre}>Civilité</Text>
                <Text style={styles.userInfo}>{props.dataUser.gender}</Text>
            <Text style={styles.titre}>Nom</Text>
                <Text style={styles.userInfo}>{props.dataUser.lastName}</Text>
            <Text style={styles.titre}>Prénom</Text>
                <Text style={styles.userInfo}>{props.dataUser.firstName}</Text>
            <Text style={styles.titre}>Adresse email</Text>
                <Text style={styles.userInfo}>{props.dataUser.email}</Text>
            <Text style={styles.titre}>Numéro de téléphone</Text>
                <Text style={styles.userInfo}>{props.dataUser.phoneNumber}</Text>
            <Text style={styles.titre}>Adresse postale</Text>
                <Text style={styles.userInfo}>{props.dataUser.address}</Text>
            <Text style={styles.titre}>Code postal</Text>
                <Text style={styles.userInfo}>{props.dataUser.postalCode}</Text>
            <Text style={styles.titre}>Ville</Text>
                <Text style={styles.userInfo}>{props.dataUser.city}</Text>
     </View>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    paddingTop : 50,
      backgroundColor: '#F1EFE5',
      alignItems: 'center',
      justifyContent: 'center',
    },
    main: {
        flex:3,  
        flexDirection : 'column',
        alignItems : 'flex-start',
        justifyContent :'flex-start',
        marginTop:30,
    },
    titre :{
        fontSize:18,
        fontWeight: 'bold',
        color: '#454543',
    },
    userInfo: {
        fontSize:16,
        color: '#C2A77D',
        fontStyle: 'italic',
        marginBottom:10,
    },
    });


    function mapStateToProps(state){
        return {dataUser:state.dataUser}
      }
    
      export default connect (
        mapStateToProps,
        null
      ) (ClientInfoScreen);
