import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#02111B',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  circleContainer: {
    width: 300, // Adjusted size to fit phone screens
    height: 300, // Adjusted size to fit phone screens
    borderRadius: 150,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 40,
  },
  profileSummary: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: 'center',
  },
  measurementItem: {
    position: 'absolute',
    width: 90,
    alignItems: 'center',
  },
  top: {
    top: -20,
    left: '50%',
    transform: [{ translateX: -45 }],
  },
  middle: {
    top: 20,
    left: '50%',
    transform: [{ translateX: -45 }],
  },
  topRight: {
    top: 20,
    right: -45,
  },
  topLeft: {
    top: 20,
    left: -45,
  },
  centerRight: {
    top: '40%',
    right: -45,
  },
  centerLeft: {
    top: '40%',
    left: -45,
  },
  bottomRight: {
    top: '60%',
    right: -45,
  },
  bottomLeft: {
    top: '60%',
    left: -45,
  },
  right: {
    top: '50%',
    right: -45,
    transform: [{ translateY: -20 }],
  },
  left: {
    top: '50%',
    left: -45,
    transform: [{ translateY: -20 }],
  },
  rightBottom: {
    top: '75%',
    right: -45,
  },
  leftBottom: {
    top: '75%',
    left: -45,
  },
  bottom: {
    bottom: -20,
    left: '50%',
    transform: [{ translateX: -45 }],
  },
  measurementLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  measurementInput: {
    backgroundColor: '#02111B',
    color: '#FFFFFF',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    width: '100%',
    textAlign: 'center',
  },
  detailsSection: {
    width: '100%',
    paddingHorizontal: 20,
  },
  measurementInputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  saveButton: {
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
