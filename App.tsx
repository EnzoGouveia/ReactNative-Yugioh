import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResult, setSearchResult] = useState<any[]>([]);

  const fetchCardsByFilter = async (filter: string) => {
    try {
      const response = await fetch(`https://db.ygoprodeck.com/api/v7/cardinfo.php?${filter}`);
      const data = await response.json();
      if (data.data && data.data.length > 0) {
        setSearchResult(data.data);
      } else {
        setSearchResult([]);
      }
    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };

  useEffect(() => {
    if (searchText) {
      fetchCardsByFilter(`fname=${searchText}`);
    } else {
      setSearchResult([]);
    }
  }, [searchText]);

  const renderCardItem = ({ item }: { item: any }) => (
    <View style={styles.cardItem}>
      <Text style={styles.cardText}>Name: {item.name}</Text>
      <Text style={styles.cardText}>Type: {item.type}</Text>
      <Text style={styles.cardText}>Description: {item.desc}</Text>
      <Text style={styles.cardText}>ATK: {item.atk}</Text>
      <Text style={styles.cardText}>DEF: {item.def}</Text>
      <Image source={{ uri: item.card_images[0].image_url }} style={styles.cardImage} />
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter card name"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchCardsByFilter(`name=${searchText}`)}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={searchResult}
        renderItem={renderCardItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.cardList}
      />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardList: {
    flexGrow: 1,
  },
  cardItem: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  cardText: {
    marginBottom: 5,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 5,
  },
});

export default App;
