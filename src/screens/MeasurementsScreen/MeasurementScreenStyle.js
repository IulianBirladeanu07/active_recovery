import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  circleContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#00bfff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSummary: {
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailsSection: {
    width: '100%',
    paddingHorizontal: 10,
  },
  measurementInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  measurementLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  input: {
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
  card: {
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  measurementLabelCard: {
    fontSize: 16,
    color: '#FFFFFF',
    flex: 1,
  },
  inputCard: {
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  saveButton: {
    flex: 1,
    marginRight: 5,
    shadowColor: '#000',
    backgroundColor: '#008080',
    padding: 15,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;