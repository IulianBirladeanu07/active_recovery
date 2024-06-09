// LoginScreenStyles.js

import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#02111B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf5ec', //4799ba
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: windowWidth - 40,
    maxWidth: 400,
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#e71d27',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: windowWidth - 40,
    maxWidth: 400,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#02111B',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: windowWidth - 40,
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#e71d27',
  },
  registerButtonText: {
    color: '#e71d27',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  error: {
    color: '#FF6347',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default styles;
