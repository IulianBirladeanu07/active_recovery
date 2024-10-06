import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#02111B',
  },
  combinedImageContainer: {
    justifyContent: 'center', // Center the images horizontally
    alignItems: 'center', // Align images vertically in the middle
    marginBottom: 16,
    marginTop: 100,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 30, // To make the images circular, if desired
    marginHorizontal: 8, // Add some spacing between the images
  },
  foodName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  foodNutrient: {
    fontSize: 16,
    marginVertical: 4,
    color: '#FFFFFF',
  },
  showMoreText: {
    fontSize: 16,
    color: '#FFD700',
    textAlign: 'center',
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#FFFFFF',
  },
  dropdownContainer: {
    position: 'relative',
  },
  unitSelector: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    marginLeft: 8,
  },
  unitText: {
    fontSize: 16,
    color: '#000000',
  },
  dropdown: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#FF5C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#FFA726', // Or any color that suits your design
    padding: 15,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  likeButtonText: {
    fontSize: 18,
    color: '#ff5a5f',
    marginTop: 10,
  },  
  favoriteIcon: {
    marginLeft: 1,
  },
});
