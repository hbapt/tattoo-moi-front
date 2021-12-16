import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import HeaderComponent from '../screens/HeaderComponent';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';



function AppointmentTatoueurScreen(props) {

    const [form, setForm] = useState([])

    useEffect(() => {
        console.log("Appoint loaded");
        const findFormTattoo = async () => {
            const dataForm = await fetch(`https://tattoomoibackend.herokuapp.com/appointment-tattoo?id=${props.dataTattoo._id}`)
            const body = await dataForm.json();

            props.saveForm(body.form)
            setForm(body.form)

        }
        console.log("formList", props.formList)
        findFormTattoo()
    }, [])

    // console.log("FORM", form[0].confirmationFormSchema[0].status)

    var appointment = props.formList.map((form, i) => {
        console.log("image", form._id)
        return (
            <Button
                key={i}
                titleStyle={styles.titleStyle}
                buttonStyle={styles.buttonStyle}

                type="outline"
                icon={<>
                    {(form.type == "Devis") ?
                        <MaterialCommunityIcons
                            name="form-select"
                            size={20}
                            color="#424D41"
                        /> :
                        <MaterialCommunityIcons

                            name="calendar-blank-outline"
                            size={20}
                            color="#424D41"
                        />}
                    <View style={styles.titleStyle}>
                        <Text style={{ color: '#424D41' }}> {form.type} {form.firstName} {form.lastName} <Text style={{ color: '#C2A77D', fontWeight: 'bold', fontStyle: 'italic' }}>{form.confirmationFormSchema[0].status}</Text> </Text>
                    </View>

                </>
                }

                onPress={() => { props.saveFormId(form), props.navigation.navigate('Mes forms') }}


            />)
    })


    // console.log(props.dataTattoo._id)
    if (props.dataTattoo !== null) {
        return (
            <View style={styles.container}>
                <HeaderComponent />
                <ScrollView style={{ marginTop: 30 }}>
                    <SafeAreaView style={styles.safeArea} >
                        {appointment}
                    </SafeAreaView>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F1EFE5',

    },
    safeArea: {
        marginLeft: 30,
        marginRight: 30
    },
    titleStyle: {
        fontSize: 14,
        marginRight: 5,
        marginLeft: 5
    },
    buttonStyle: {
        borderColor: '#424D41',
        marginBottom: 20,
        justifyContent: 'flex-start',
        borderWidth: 1,
        borderRadius: 5
    },


});

function mapStateToProps(state) {
    return { dataTattoo: state.dataTattoo, formList: state.formList }
}

function mapDispatchToProps(dispatch) {
    return {

        saveForm: function (dataSaveForm) {
            dispatch({
                type: 'saveForm',
                dataSaveForm: dataSaveForm
            })
        },
        saveFormId: function (formId) {
            dispatch({
                type: 'saveFormId',
                formId
            })
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AppointmentTatoueurScreen)

