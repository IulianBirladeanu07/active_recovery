import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-between', // Adjusted to space between
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  progressBarValue: {
    fontSize: 16,
    color: '#fff',
  },
  lastWorkoutContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 100,
  },
  lastWorkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bestSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestSetText: {
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: 10,
    paddingTop: 30,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 5,
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryCard: {
    width: '30%', // Adjusted width to fit in a row
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E6D5E',
  },
  summaryCardText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginTop: 5,
    textAlign: 'center',
  },
  summaryCardIcon: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  startButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 40,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
});

export default styles;
