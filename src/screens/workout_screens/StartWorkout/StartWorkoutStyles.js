import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 300, // Adjust this value to your needs
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addSetButton: {
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
    marginTop: 20,
    marginBottom: 10,
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
  selectedExerciseName: {
    fontSize: 20,
    color: '#FFFFFF',
    marginLeft: 18,
    marginTop: 20,
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
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
  validationButtonText: {
    fontSize: 24,
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#02111B',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff'
  },
  modalButtonClose: {
    backgroundColor: '#e71d27',
    right: 90,
    top: 40,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 36,
  },
  modalButtonFinish: {
    left: 90,
    backgroundColor: '#008080',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 45,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 100, // Adjust as needed
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackText: {
    color: 'white', // Choose a color that stands out
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    padding: 10,
    borderRadius: 5,
  },
});

export default styles;
