import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#02111B',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    width: '100%',
  },
  summaryCardText: {
    color: '#fdf5ec',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Center align the text
  },
  summaryCardDetails: {
    color: '#fdf5ec',
    fontSize: 16,
    marginTop: 10, // Add spacing between the text and summary details
    textAlign: 'center', // Center align the text
  },
  startButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fdf5ec',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
