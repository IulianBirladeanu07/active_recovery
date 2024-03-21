// StartWorkoutStyles.js
import { StyleSheet } from 'react-native';

export const startWorkoutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
  },
  deleteContainer: {
    backgroundColor: 'red', 
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: '100%',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 300, // Adjust this value to your needs
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40, // Changed 'top' to 'paddingTop'
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addSetButton: {
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  addSetButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  addExercisesButton: {
    top: 10,
    left: 0,
    right: 0,
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  addExercisesButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  finishButton: {
    position: 'absolute',
    bottom: 58,
    left: 0,
    right: 0,
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  finishButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  exitButton: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 320,
    height: 45,
    paddingHorizontal: 10,
    marginTop: 20, // Adjusted 'marginTop'
    backgroundColor: 'white',
    borderRadius: 10,
    alignSelf: 'center',
  },
  exitButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24,
  },
});
