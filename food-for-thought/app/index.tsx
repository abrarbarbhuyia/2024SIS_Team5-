import { View, Dimensions, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { Button, Card, Text, Icon } from '@rneui/themed';
import SearchBar from "@/components/SearchBar";
import Header from "@/components/Header";     
import pic from '../assets/images/react-logo.png';        

        //mock data images for carousel
const carouselData = [
  { id: '1', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '2', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '3', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '4', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '5', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '6', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
  { id: '7', image: pic, label: 'Restaurant Title', secondLabel: 'Cuisine' },
];


export default function Index() {
  //carousel view + styling
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity onPress={() => router.push('/restaurant')}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.recentLabel}>{item.label}</Text>
        <Text style={styles.recentComment}>{item.secondLabel}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={styles.container}>
      <Header homepage={true}></Header>
      {/* Card for the Restaurant finder */}
        <TouchableOpacity onPress={() => router.push('/map')}>
          <Card containerStyle={styles.finderCard}>
            <View style={{  }}>
              <SearchBar/>             
            </View>
            <Card.Image
                style={{ padding: 0, height: 100 }}
                source={{
                  uri:
                    'https://developers.google.com/static/maps/images/landing/hero_maps_static_api.png',
                }}
              />
          </Card>
        </TouchableOpacity>
      {/* Card for recently visited Restaurants */}
      <Card containerStyle={styles.recentCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text h4 style={{color: '#2E1C47'}}>Last Visited</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recent arrow clicked")} />
        </View>
        {/* rendering the pics in carousel */}
        <FlatList
          data={carouselData}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        />
      </Card>
      {/* Card for restaurant recommndations */}
      <Card containerStyle={styles.recommendationsCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text h4 style={{color: '#2E1C47'}}>Recommendations</Text>
          <Icon name="arrowright" type="antdesign" size={25} onPress={() => console.log("Recommendations arrow clicked")} />
        </View>

        {/* to be sectioned off into a component */}

        <TouchableOpacity style={{padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16}} onPress={() => router.push('/restaurant')}>
          <View style={{flexDirection: 'row'}}>
            <Image source={pic} />
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Restaurant Title</Text>
              <Text style={{fontSize: 13}}>Restaurant blurb/quick important information</Text>
              <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                <Icon name="star-outlined" type="entypo" size={25} onPress={() => console.log("favourite clicked")} />
                <Text style={{fontSize: 11, padding: 5}}>Add to Favourites</Text>  
              </View>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={{padding: 3, backgroundColor: 'white', marginBottom: 5, borderRadius: 16}} onPress={() => router.push('/restaurant')}>
        <View style={{flexDirection: 'row'}}>
            <Image source={pic} />
            <View style={{flex: 1, flexDirection: 'column'}}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Restaurant Title</Text>
              <Text style={{fontSize: 13}}>Restaurant blurb/quick important information</Text>
              <View style={{flex: 1, alignItems: 'center', flexDirection: 'row'}}>
                <Icon name="star-outlined" type="entypo" size={25} onPress={() => console.log("favourite clicked")} />
                <Text style={{fontSize: 11, padding: 5}}>Add to Favourites</Text>  
              </View>
            </View>
          </View>
        </TouchableOpacity>


      </Card>
    </View>
  );
}

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E6D7FA",
  },
  finderCard: {
    width: width - 32,
    height: 200,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recentCard: {
    width: width - 32,
    height: 210,
    backgroundColor: "#FBF8FF",
    padding: 12,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 5,
  },
  recommendationsCard: {
    width: width - 32,
    height: 275,
    backgroundColor: "#FBF8FF",
    padding: 10,
    borderRadius: 24,
    marginTop: 5,
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 2,
    shadowRadius: 4,
    justifyContent: "space-between",
    marginBottom: 10,
  },
  carousel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  imageContainer: {
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    width: 120,
    height: 145,
  },
  image: {
    width: '100%',
  },
  recentLabel: {
    marginLeft: 5,
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 12,
  },
  recentComment: {
    marginLeft: 5,
    fontSize: 10,
    opacity: 0.5,
  }
});
