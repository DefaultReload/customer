import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import { db } from './firebaseConfig'; // Adjust the import path as necessary
import { ref, onValue } from 'firebase/database';
import { Picker } from '@react-native-picker/picker'; // Import Picker for dropdown

const SleepingPods = () => {
    const [pods, setPods] = useState([]);
    const [hours, setHours] = useState('');

    useEffect(() => {
        const podsRef = ref(db, 'sleepingPods');

        const unsubscribe = onValue(podsRef, (snapshot) => {
            const data = snapshot.val();
            const podsArray = [];

            if (data) {
                for (let key in data) {
                    podsArray.push({
                        ...data[key],
                        id: key, // Add the key as the id for later use if needed
                    });
                }
            }

            console.log(podsArray); // Log the podsArray to check its structure
            setPods(podsArray);
        });

        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            {/* Dropdown for Number of Hours */}
            <Text style={styles.label}>Number of Hours:</Text>
            <Picker
                selectedValue={hours}
                style={styles.picker}
                onValueChange={(itemValue) => setHours(itemValue)}
            >
                <Picker.Item label="Select hours" value="" />
                <Picker.Item label="1 hour" value="1" />
                <Picker.Item label="2 hours" value="2" />
                <Picker.Item label="3 hours" value="3" />
                <Picker.Item label="4 hours" value="4" />
                <Picker.Item label="5 hours" value="5" />
            </Picker>

            {/* Pods List */}
            <Text style={styles.header}>Sleeping Pods</Text>
            <FlatList
                data={pods} // Directly use the pods array
                numColumns={2} // Display 2 items per row
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.podCard}>
                        <Image source={{ uri: item.image_url }} style={styles.podImage} />
                        <Text style={styles.podTitle}>Max {item.persons} guests / {item.bed} bed</Text>
                        <Text style={styles.podPrice}>From R{item.price}/hour</Text>
                    </View>
                )}
                scrollEnabled={true} // Allow FlatList to handle its own scrolling
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    podCard: {
        flex: 1,
        margin: 8,
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        elevation: 2,
    },
    podImage: {
        width: '100%',
        height: 100,
        borderRadius: 8,
    },
    podTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
    },
    podPrice: {
        fontSize: 12,
        color: '#888',
    },
});

export default SleepingPods;
