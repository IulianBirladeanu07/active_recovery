// ExerciseItemStyles.js
import { StyleSheet } from 'react-native';

export const exerciseItemStyles = StyleSheet.create({
  exerciseContainer: {
    marginBottom: 10,
  },
  selectedExerciseName: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 18,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
  },
  inputField: {
    flex: 1,
    height: 35,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 7,
    marginRight: 5,
  },
  validationButton: {
    backgroundColor: '#808080',
    borderRadius: 7,
    width: 50,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validationButtonPressed: {
    backgroundColor: '#008080',
  },
  validationButtonNotPressed: {
    backgroundColor: '#808080',
  },
  validationButtonText: {
    fontSize: 24,
    color: 'white',
  },
  addSetButton: {
    bottom: -12,
    left: 0,
    right: 0,
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: 11,
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
});
