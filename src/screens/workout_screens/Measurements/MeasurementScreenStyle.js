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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  circleContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#00bfff',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  profileSummary: {
    alignItems: 'center',
  },
  detailsSection: {
    width: '100%',
    paddingHorizontal: 10,
  },
  measurementInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    alignItems: 'center',
  },
  measurementLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  measurementInput: {
    backgroundColor: '#02202B',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    flex: 1,
    textAlign: 'center',
    marginLeft: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#00bfff',
  },
  singleInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    alignItems: 'center',
  },
  singleMeasurementLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'left',
    marginBottom: -10,
  },
  singleMeasurementInput: {
    backgroundColor: '#02202B',
    color: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    fontSize: 14,
    flex: 2,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#00bfff',
  },
  saveButton: {
    backgroundColor: '#008080',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
