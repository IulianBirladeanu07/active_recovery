import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    paddingTop: 50,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 300, // Adjust this value to your needs
  },
  text: {
    fontSize: 14,
    color: '#FFFFFF'
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // You can adjust the color to your preference
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  templateContainer: {
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    position: 'relative', // Add this to allow positioning of the edit button
  },
  templateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  createTemplateButton: {
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  createTemplateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Edit button styles
  editButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 5,
    backgroundColor: 'transparent',
  },
  editButtonText: {
    color: 'white',
    fontSize: 20,
  },
  dropdown: {
    position: 'absolute',
    right: 20,
    top: 40,
    backgroundColor: '#02202B',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 10,
    left: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  dropdownItemText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
  },
  cancelButtonText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
});
