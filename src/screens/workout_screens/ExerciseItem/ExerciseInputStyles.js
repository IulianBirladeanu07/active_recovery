import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 0
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
});

export default styles;
