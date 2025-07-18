import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';

const UNSPLASH_ACCESS_KEY = 'yqGPaErzxhlgNE5SuOAMhcixF4BymU06bU28PiCfM0I'; // Replace with your Unsplash Access Key

export default function TravelPlanner({ navigation }) {
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [plan, setPlan] = useState('');
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePlanTrip = async () => {
    if (!destination || !date) {
      setPlan("Please fill in all fields.");
      return;
    }

    setPlan(`🎒 Your trip to ${destination} on ${date} is all set! \n\n🌤️ Weather: Sunny \n🏨 Hotels: Book via Booking.com \n🚗 Pack your bags and enjoy!`);

    setLoading(true);
    try {
      const searchQuery = destination || 'paris'; // Fallback for testing
      const response = await fetch(
        `https://api.unsplash.com/search/photos?page=1&query=${searchQuery}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      console.log("📸 Unsplash API response:", data); // Log full API response

      if (Array.isArray(data.results)) {
        setPhotos(data.results);
      } else {
        console.warn("No photo results found.");
        setPhotos([]);
      }
    } catch (error) {
      console.error('❌ Error fetching photos:', error);
      setPhotos([]);
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.header}>✈️ Travel Assistant</Text>

      <TextInput
        placeholder="Enter destination"
        style={styles.input}
        value={destination}
        onChangeText={setDestination}
      />

      <TextInput
        placeholder="Enter travel date"
        style={styles.input}
        value={date}
        onChangeText={setDate}
      />

      <Button title="Plan My Trip" onPress={handlePlanTrip} disabled={loading} />

      {plan !== '' && (
        <View style={styles.planBox}>
          <Text style={styles.planText}>{plan}</Text>
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#4B5563" style={{ marginTop: 20 }} />}

      {!loading && photos.length > 0 && (
        <View style={styles.photoContainer}>
          <Text style={styles.photoHeader}>📸 Photos of {destination}</Text>
          {photos.slice(0, 5).map((photo) => (
            <Image
              key={photo.id}
              source={{ uri: photo.urls.regular }}
              style={styles.photo}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {/* Optional test image to verify rendering */}
      <View style={{ marginTop: 30 }}>
        <Text style={{ fontWeight: 'bold' }}>🧪 Test Image (should always load):</Text>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' }}
          style={styles.photo}
        />
      </View>

      <Button title="← Back to ChatBot" onPress={() => navigation.navigate('ChatBot')} color="#4B5563" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#F0F9FF', flexGrow: 1 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  planBox: {
    backgroundColor: '#D1FAE5',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  planText: {
    fontSize: 16,
    color: '#065F46',
  },
  photoContainer: {
    marginTop: 20,
  },
  photoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    marginBottom: 10,
  },
});
