import React from "react";
import { StyleSheet, Text, View, Image, ScrollView , SafeAreaView, FlatList} from "react-native";

import { connect } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

import HeaderComponent from "../screens/HeaderComponent";

function TattooInfosScreen(props) {

    const gallery = props.dataTattoo.galleryPhoto.map((photo, i) => {
        return (
          <Image
          key={i}
            source={{ uri: photo }}
            style={{ width: 110, height: 110, marginBottom: 10 }}
          />
        );
      })

  return (
    <View style={styles.container}>
      <HeaderComponent />
<ScrollView style= {{ flex: 3, width:400}}>
<SafeAreaView>
      <View style={styles.main}>
       
      <View style={{ alignSelf:'flex-end'}}>
    
    <Image 
        source={{ uri: props.dataTattoo.profilePicture }}
        style={styles.imgTatoueur}
      />
</View>
<View style={{marginTop:-130}}>
      <Text style={styles.titre}>Civilité</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.gender}</Text>

    <Text style={styles.titre}>Nom</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.lastName}</Text>

        <Text style={styles.titre}>Prénom</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.firstName}</Text>

        <Text style={styles.titre}>Adresse email</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.email}</Text>

        <Text style={styles.titre}>Numéro de téléphone</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.phoneNumber}</Text>

        <Text style={styles.titre}>Numéro de SIRET</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.siret}</Text>

        <Text style={styles.titre}>Temps d'attente</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.schedule}</Text>
{/* map a faire */}
        <Text style={styles.titre}>Style(s)</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.styleList.join(', ')}</Text>
{/* map a faire */}
        <Text style={styles.titre}>Couleur</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.color.join(', ')}</Text>

        <Text style={styles.titre}>Site web</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.website}</Text>

        <Text style={styles.titre}>Profil Facebook</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.facebook}</Text>

        <Text style={styles.titre}>Profil Instagram</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.instagram}</Text>
     
        <Text style={styles.titre}>TattooShop</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.tattooShopAddress[0].tattooShop}</Text>

        <Text style={styles.titre}>Adresse postale</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.tattooShopAddress[0].address}</Text>

        <Text style={styles.titre}>Code postal</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.tattooShopAddress[0].postalCode}</Text>

        <Text style={styles.titre}>Ville</Text>
        <Text style={styles.userInfo}>{props.dataTattoo.tattooShopAddress[0].city}</Text>

        <Text style={styles.titre}>Gallerie photo</Text>
        
      </View>

      
      </View>

      <View
        
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            flexWrap: "wrap",
            marginVertical:15,
            marginLeft:10,
          }}
        >
          {gallery}
        </View>
      </SafeAreaView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 50,
    backgroundColor: "#F1EFE5",
    alignItems: "flex-start",
    justifyContent: "center",
    maxWidth: 500,
  },
  main: {
    flex: 3,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginTop: 30,
    marginLeft: 40,
  },
  titre: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#454543",
  },
  imgTatoueur: {
    marginRight: 50,
    marginBottom: -20,
    width: 135,
    height: 135,
    borderRadius: 75,
  },
  userInfo: {
    fontSize: 16,
    color: "#C2A77D",
    fontStyle: "italic",
    marginBottom: 10,
  },
});

function mapStateToProps(state) {
  return { dataTattoo: state.dataTattoo };
}

export default connect(mapStateToProps, null)(TattooInfosScreen);
