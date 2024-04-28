import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 300, // Adjust this value to your needs
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  templateContainer: {
    backgroundColor: '#02111B',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: '#e71d27',
  },
  templateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  createTemplateButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default styles;
