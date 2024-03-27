import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from './ModalComponentStyle'

const ModalComponent = ({ isVisible, message, closeModal, onFinish }) => {
  return (
    <Modal transparent visible={isVisible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalMessage}>{message}</Text>
          <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFinish} style={styles.modalButton}>
            <Text style={styles.modalButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
