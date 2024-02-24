import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [breeds, setBreeds] = useState([]);
  const [error, setError] = useState(null);
  const [breedImages, setBreedImages] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        const data = await response.json();
        setBreeds(Object.keys(data.message)); 

        const initialBreedImages = {};
        for (const breed of Object.keys(data.message)) {
          initialBreedImages[breed] = null;
        }
        setBreedImages(initialBreedImages);

        for (const breed of Object.keys(data.message)) {
          const imageResponse = await fetch(`https://dog.ceo/api/breed/${breed}/images/random`);
          const imageData = await imageResponse.json();
          setBreedImages((prevImages) => ({
            ...prevImages,
            [breed]: imageData.message
          }));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData(); 

  }, []); 

  const renderItem = ({ item }) => (
    <View style={styles.breedItem}>
      <Text style={styles.breedText}>{item}</Text>
      {breedImages[item] && (
        <Image
          source={{ uri: breedImages[item] }}
          style={styles.breedImage}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Cargando...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : (
        <FlatList
          data={breeds}
          keyExtractor={(item) => item}
          renderItem={renderItem}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
  breedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  breedText: {
    fontSize: 18,
    marginRight: 10,
    margin:30,
    color:'white',
    
  },
  breedImage: {
    width: 100,
    height: 100,
    margin:30,
    borderRadius: 10,
    justifyContent:"rigth"
  },
});
