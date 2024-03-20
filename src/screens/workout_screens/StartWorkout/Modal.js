// Modal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { modalStyles } from './ModalStyle';

const ModalComponent = ({ isModalVisible, closeModal, modalMessage, sendWorkoutDataToFirestore }) => {
  return (
    <Modal transparent visible={isModalVisible} animationType="slide">
      <View style={modalStyles.modalContainer}>
        <View style={modalStyles.modalContent}>
          <Text style={modalStyles.modalMessage}>{modalMessage}</Text>
          <TouchableOpacity onPress={closeModal} style={modalStyles.modalButtonClose}>
            <Text style={modalStyles.modalButtonText}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendWorkoutDataToFirestore} style={modalStyles.modalButtonFinish}>
            <Text style={modalStyles.modalButtonText}>Finish</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalComponent;
