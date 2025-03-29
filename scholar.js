import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Mock scholarship data (replace with actual data fetching)
const SCHOLARSHIPS = [
  { id: '1', title: 'Merit Scholarship', amount: 1000, eligibility: 'GPA 3.5+', deadline: '2024-12-31', description: 'For students with high academic achievement.' },
  { id: '2', title: 'Need-Based Scholarship', amount: 1500, eligibility: 'Low-income students', deadline: '2025-01-15', description: 'For students with financial need.' },
  { id: '3', title: 'STEM Scholarship', amount: 2000, eligibility: 'Majoring in STEM field', deadline: '2024-11-30', description: 'For students pursuing studies in Science, Technology, Engineering, and Mathematics.' },
  { id: '4', title: 'Community Service Scholarship', amount: 1200, eligibility: 'Active in community service', deadline: '2025-02-28', description: 'For students who have demonstrated a commitment to community service.' },
];

const ScholarshipFinder = () => {
  const [scholarships, setScholarships] = useState(SCHOLARSHIPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCriteria, setFilterCriteria] = useState('all');
  const [filteredScholarships, setFilteredScholarships] = useState(SCHOLARSHIPS);
  const [selectedScholarship, setSelectedScholarship] = useState(null);

  const filterOptions = ['all', 'title', 'eligibility'];

  useEffect(() => {
    // Apply filters
    let result = scholarships;
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterCriteria === 'title') {
        result = scholarships.filter(scholarship =>
          scholarship.title.toLowerCase().includes(searchTermLower)
        );
      } else if (filterCriteria === 'eligibility') {
        result = scholarships.filter(scholarship =>
          scholarship.eligibility.toLowerCase().includes(searchTermLower)
        );
      } else {
        result = scholarships.filter(
          (scholarship) =>
            scholarship.title.toLowerCase().includes(searchTermLower) ||
            scholarship.eligibility.toLowerCase().includes(searchTermLower)
        );
      }
    }
    setFilteredScholarships(result);
  }, [searchTerm, filterCriteria, scholarships]);

  const handleScholarshipSelect = (scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const handleApply = () => {
    if (selectedScholarship) {
      Alert.alert(
        'Apply for Scholarship',
        `You are about to apply for ${selectedScholarship.title}.  Would you like to continue?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'OK', onPress: () => {
              // Handle the application process (e.g., navigate to a form, open a website)
              Alert.alert('Application Started', 'The application process has begun.');
              setSelectedScholarship(null); // Clear selection
            }
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scholarship Finder</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search scholarships..."
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />
        <Picker
          selectedValue={filterCriteria}
          onValueChange={(itemValue) => setFilterCriteria(itemValue)}
          style={{ width: '100%' }}
        >
          {filterOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredScholarships}
        renderItem={({ item }) => (
          <Button
            style={styles.scholarshipItem}
            onPress={() => handleScholarshipSelect(item)}
          >
            <View style={styles.scholarshipItemContent}>
              <Text style={styles.scholarshipTitle}>{item.title}</Text>
              <Text style={styles.scholarshipEligibility}>
                Eligibility: {item.eligibility}
              </Text>
              <Text style={styles.scholarshipDeadline}>
                Deadline: {item.deadline}
              </Text>
            </View>
          </Button>
        )}
        keyExtractor={(item) => item.id}
      />

      {selectedScholarship && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedScholarship.title}</Text>
            <Text style={styles.modalText}>
              {selectedScholarship.description}
            </Text>
            <Text style={styles.modalEligibility}>
              Eligibility: {selectedScholarship.eligibility}
            </Text>
            <Text style={styles.modalDeadline}>
              Deadline: {selectedScholarship.deadline}
            </Text>
            <Text style={styles.modalAmount}>
              Amount: ${selectedScholarship.amount}
            </Text>
            <Button title="Apply Now" onPress={handleApply} />
            <Button
              title="Close"
              onPress={() => setSelectedScholarship(null)}
              color="gray"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  scholarshipItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'flex-start',
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    marginVertical: 5,
  },
  scholarshipItemContent: {
    alignItems: 'flex-start',
  },
  scholarshipTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scholarshipEligibility: {
    fontSize: 14,
    color: 'gray',
  },
  scholarshipDeadline: {
    fontSize: 14,
    color: 'red',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalEligibility: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
  },
  modalDeadline: {
    fontSize: 14,
    color: 'red',
    marginBottom: 5,
  },
  modalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default ScholarshipFinder;