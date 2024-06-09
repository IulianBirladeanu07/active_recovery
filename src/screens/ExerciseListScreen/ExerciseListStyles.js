import { StyleSheet } from 'react-native';

const exerciseListStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#02111B',
  },
  headerContainer: {
    marginBottom: 24,
    marginTop: 20,
    alignSelf: 'center',
    flexDirection: 'column',  // Ensure layout flows vertically
    alignItems: 'center',     // Center align items for better aesthetics
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  searchContainer: {
    flexDirection: 'row',  // Horizontal layout for search elements
    marginTop: 10,         // Add a little space from the title
    width: '100%',         // Full width to utilize space
    paddingHorizontal: 10, // Horizontal padding
    alignItems: 'center',  // Center items vertically
  },
  searchInput: {
    flex: 1,                  // Take up all available space
    height: 40,               // Fixed height for the input
    backgroundColor: '#fff',  // Light background for the input
    borderColor: '#ccc',      // Border color
    borderWidth: 1,           // Border width
    borderRadius: 20,         // Rounded borders
    paddingHorizontal: 10,    // Inner spacing for text
    fontSize: 16,             // Font size
    color: '#333',            // Text color for input
  },
  listContainer: {
    paddingBottom: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdf5ec',
    marginBottom: 20,
    left: 12,
  },
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fdf5ec',
  },
});

export default exerciseListStyles;
