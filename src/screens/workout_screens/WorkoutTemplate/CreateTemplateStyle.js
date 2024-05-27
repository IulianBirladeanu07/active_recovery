import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: RFValue(20),
  },
  input: {
    height: RFValue(45),
    backgroundColor: '#FFFFFF',
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(20),
    fontSize: RFValue(16),
    marginBottom: RFValue(15),
    marginTop: RFValue(20),
    borderColor: '#008080',
    borderWidth: 1,
  },
  exerciseContainer: {
    backgroundColor: '#02202B',
    borderRadius: RFValue(10),
    padding: RFValue(15),
    marginBottom: RFValue(15),
    borderColor: '#008080',
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: RFValue(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: RFValue(10),
  },
  column: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#008080',
    paddingVertical: RFValue(10),
    paddingHorizontal: RFValue(20),
    borderRadius: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RFValue(10),
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  createTemplateButton: {
    backgroundColor: '#29335c',
    paddingVertical: RFValue(15),
    borderRadius: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RFValue(20),
  },
  createTemplateButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputField: {
    flex: 1,
    height: RFValue(45),
    backgroundColor: '#FFFFFF',
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(20),
    fontSize: RFValue(16),
    marginBottom: RFValue(10),
    borderColor: '#008080',
    borderWidth: 1,
    marginHorizontal: RFValue(5),
  },
});

export default styles;
