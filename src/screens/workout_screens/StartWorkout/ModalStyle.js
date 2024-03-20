// ModalStyles.js
import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
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
});
