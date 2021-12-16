import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import HeaderComponent from './HeaderComponent';
import MapView, { Marker } from 'react-native-maps';

import * as Location from 'expo-location';

function MapScreen(props) {

    const [coord, setCoord] = useState([]);

    useEffect(() => {

        let temp = [];

        const geoCode = async () => {

            for (let i = 0; i < props.saveTatoueurInfos.length; i++) {
                let tatoueur = props.saveTatoueurInfos[i]
                let result = await Location.geocodeAsync(`${tatoueur.tattooShopAddress[0].address} ${tatoueur.tattooShopAddress[0].city}`)

                var firstName = tatoueur.firstName
                var tattooShop = tatoueur.tattooShopAddress[0].tattooShop
                var address = tatoueur.tattooShopAddress[0].address
                var postalCode = tatoueur.tattooShopAddress[0].postalCode
                var city = tatoueur.tattooShopAddress[0].city


                temp.push(
                    result[0]
                )

                for (let i = 0; i < temp.length; i++) {
                    result[0].firstName = firstName;
                    result[0].tattooShop = tattooShop;
                    result[0].address = address;
                    result[0].postalCode = postalCode;
                    result[0].city = city
                }
            }

            if (temp.length > 0) {
                setCoord(temp)
            }
        }

        geoCode()

    }, [])

    const searchResults = coord.map((latLong, i) => {
        return (
            <Marker
                key={i}
                pinColor='blue'
                coordinate={{ latitude: latLong.latitude, longitude: latLong.longitude }}
                title={`${latLong.tattooShop}`}
                description={`${latLong.address} ${latLong.postalCode} ${latLong.city}`}
            />
        )
    })


    return (
        <View style={styles.container}>
            <HeaderComponent navigation={props.navigation} />

            <MapView
                region={{
                    latitude: props.saveUserPosition.latitude,
                    longitude: props.saveUserPosition.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.1,
                }}
                style={[styles.map, { marginTop: 15, borderRadius: 30 }]}
                loadingEnabled={true}
            >
                <Marker
                    pinColor='#eb4d4b'
                    coordinate={{ latitude: props.saveUserPosition.latitude, longitude: props.saveUserPosition.longitude }}
                    title='Vous êtes ici'
                />
                {searchResults}
            </MapView>
            <View style={{ flex: 1, width: '100%' }}>
                <ScrollView>

                    {props.saveTatoueurInfos.map((tatoueur, i) => {

                        return (
                            <TouchableOpacity
                                onPress={() => { props.selectedArtistInfos(tatoueur), props.navigation.navigate('TattooArtist') }}
                                style={{ backgroundColor: '#F1EFE5' }}>
                                <Card containerStyle={styles.cards}>
                                    <View style={styles.cardDesc}>
                                        <View>
                                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#424D41' }}>{tatoueur.firstName}</Text>
                                            <Text style={{ marginBottom: 10, fontWeight: 'bold', paddingTop: 5, color: '#424D41' }}>
                                                {tatoueur.tattooShopAddress[0].tattooShop}
                                            </Text>
                                            <Text style={{ fontStyle: 'italic', color: '#424D41' }}>{tatoueur.styleList.join(', ')}</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: '#424D41' }}>Attente: {tatoueur.schedule}</Text>
                                            <Text style={{ paddingTop: 5, color: '#424D41' }}>{tatoueur.tattooShopAddress[0].city}</Text>
                                        </View>
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F1EFE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    main: {
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
        marginBottom: 10
    },
    logo: {
        width: 200,
        height: 80,
        marginRight: 70
    },
    connexionBtn: {
        backgroundColor: '#F1EFE5',
        paddingRight: 5,
        paddingLeft: 5,
        marginRight: 10,
        marginTop: 20
    },
    titleBtn: {
        color: '#424D41',
        marginBottom: 10,
        fontSize: 15
    },
    cardDesc: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
        backgroundColor: '#F1EFE5',
        borderRadius: 10
    },
    cards: {
        padding: 0,
        borderWidth: 0.1,
        borderColor: '#424D41',
        backgroundColor: '#F1EFE5'
    },
    city: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#454543',
    },
    map: {
        marginBottom: 25,
        marginTop: 15,
        width: '90%',
        height: '35%',
        borderRadius: 70,
    }
});

function mapStateToProps(state) {
    return { saveTatoueurInfos: state.saveTatoueurInfos, dataUser: state.dataUser, saveUserPosition: state.saveUserPosition }
}

const mapDispatchToProps = (dispatch) => {
    return {
        selectedArtistInfos: (artistInfos) => dispatch({ type: 'selectedArtistInfos', artistInfos })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
