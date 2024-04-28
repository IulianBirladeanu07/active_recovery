import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    paddingBottom: RFValue(10),
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(60),
  },
  input: {
    height: RFValue(45),
    backgroundColor: '#FFFFFF',
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(20),
    marginBottom: RFValue(5),
    marginRight: 2,
  },
  addButton: {
    fontSize: RFValue(18),
    color: '#FFFFFF',
    backgroundColor: '#e71d27',
    paddingVertical: RFValue(10),
    borderRadius: RFValue(10),
    textAlign: 'center',
    marginTop: RFValue(2),
    marginBottom: RFValue(5),
  },
  createTemplateButton: {
    fontSize: RFValue(18),
    color: '#FFFFFF',
    backgroundColor: '#e71d27',
    paddingVertical: RFValue(15),
    borderRadius: RFValue(10),
    textAlign: 'center',
    marginTop: RFValue(20),
  },
  exerciseName: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: RFValue(5),
  },
  row: {
    flexDirection: 'row',
    marginBottom: RFValue(0),
  },
  column: {
    flex: 1,
  },
  label: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    marginBottom: RFValue(5),
  },
  setInput: {
    height: RFValue(10),
    backgroundColor: '#FFFFFF',
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(20),
  },
});

export default styles;
