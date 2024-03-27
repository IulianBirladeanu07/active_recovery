import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtonClose: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modalButtonFinish: {
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default styles;
