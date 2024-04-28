import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

const WorkoutTemplate = () => {
  const [templates, setTemplates] = useState([
    { id: 1, name: 'Full Body Workout', exercises: ['Squats', 'Bench Press', 'Deadlifts'] },
    { id: 2, name: 'Upper Body Workout', exercises: ['Bench Press', 'Pull-ups', 'Shoulder Press'] },
    // Add more pre-defined templates as needed
  ]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState('');

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    // Navigate to the template editing screen or display the editing interface here
  };

  const handleSaveTemplateChanges = () => {
    // Save changes to the template
    // Update templates state if necessary
    setEditingTemplate(null);
  };

  const handleCreateNewTemplate = () => {
    // Create a new template with the provided name and empty exercises list
    // Add the new template to the templates state
    setTemplates(prevTemplates => [...prevTemplates, { id: Date.now(), name: newTemplateName, exercises: [] }]);
    setNewTemplateName(''); // Clear input field
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Choose a Template:</Text>
      {templates.map(template => (
        <TouchableOpacity key={template.id} onPress={() => handleEditTemplate(template)} style={styles.templateItem}>
          <Text style={styles.templateName}>{template.name}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.heading}>Create New Template:</Text>
      <TextInput
        placeholder="Enter template name"
        value={newTemplateName}
        onChangeText={setNewTemplateName}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleCreateNewTemplate} style={styles.createButton}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
      
      {/* Display editing interface if editingTemplate is not null */}
      {editingTemplate && (
        <View>
          <Text style={styles.heading}>Edit Template: {editingTemplate.name}</Text>
          {/* Editing interface goes here */}
          <TouchableOpacity onPress={handleSaveTemplateChanges} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
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
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  templateItem: {
    marginBottom: 10,
  },
  templateName: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  createButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WorkoutTemplate;
