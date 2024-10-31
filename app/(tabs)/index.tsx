import 'react-native-get-random-values';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Parse from 'parse/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Parse only once
Parse.setAsyncStorage(AsyncStorage);
Parse.initialize(
  'YOUR APPLICATION ID HERE',     // Replace with your Parse Application ID
  'YOUR JAVASCRIPT KEY HERE'      // Replace with your Parse JavaScript key
);
Parse.serverURL = 'https://parseapi.back4app.com/'; 

interface TestObject {
  id: string;
  name: string;
}

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  // Function to create a new Person 
  async function createPerson() {
    setLoading(true);
    setError(null);
    
    try {
      const PersonObject = Parse.Object.extend("Person");
      const personObject = new PersonObject();
      
      personObject.set("name", "Back4App User");
      
      const result = await personObject.save();
      setResult(`Object created with ID: ${result.id}`);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  async function fetchPeople() {
    setLoading(true);
    setError(null);
    
    try {
      const PersonObject = Parse.Object.extend("Person");
      const query = new Parse.Query(PersonObject);
      
      const results = await query.find();
      const names = results.map(result => ({
        objectId: result.id,
        name: result.get("name"),
      }));
      
      setResult(`Fetched names: ${JSON.stringify(names, null, 2)}`);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <View style={{ alignItems: 'center', marginBottom: 30, marginTop: 20 }}>
        <Image
          source={{ uri: 'https://www.back4app.com/_public/img/back4app-logo.png' }}
          style={{ width: 200, height: 50, resizeMode: 'contain' }}
        />
      </View>
      <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        Back4App React Native Example
      </Text>

      <TouchableOpacity 
        onPress={createPerson}
        disabled={loading}
        style={{ backgroundColor: '#3498db', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 }}
      >
        <Text style={{ color: 'white' }}>
          {loading ? 'Creating object...' : 'Create'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={fetchPeople}
        disabled={loading}
        style={{ backgroundColor: '#3498db', padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 10 }}
      >
        <Text style={{ color: 'white' }}>
          {loading ? 'Fetching object...' : 'Fetch'}
        </Text>
      </TouchableOpacity>

      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      )}

      {error && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#ffebee' }}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      )}

      {result && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#e8f5e9' }}>
          <Text style={{ color: 'green' }}>{result}</Text>
        </View>
      )}
    </View>
  );
}
