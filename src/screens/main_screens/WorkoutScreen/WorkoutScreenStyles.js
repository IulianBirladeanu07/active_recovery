// WorkoutScreenStyles.js
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  startButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
