import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#02111B', // Dark background
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
  },
  statsContainer: {
    backgroundColor: '#02202B',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  circularProgressContainer: {
    alignItems: 'center',
    marginVertical: 5,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: -50
  },
  innerProgressItem: {
    alignItems: 'center',
  },
  innerProgressText: {
    color: '#FFFFFF', // White text
    fontSize: 13,
    marginTop: 5,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Spread the progress bars evenly
    width: '100%',
    marginTop: 12,
  },
  card: {
    backgroundColor: '#02202B', // Card background color
    padding: 15,
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 10,
  },
  lastWorkoutScroll: {
    maxHeight: 80, 
  },
  lastWorkoutContent: {
    paddingVertical: 2,
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  exerciseName: {
    color: '#FFFFFF', // White text
    fontSize: 12,
  },
  bestSetContainer: {
    alignItems: 'flex-end',
  },
  bestSetText: {
    color: '#FFFFFF', // White text
    fontSize: 12,
  },
  noWorkoutsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  noWorkoutsText: {
    color: '#FFFFFF', // White text
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Spread quick action buttons evenly
    width: '100%',
    marginTop: 10,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF', // Orange for quick action card
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    width: '30%', // Adjust width as needed
  },
  summaryCardText: {
    color: '#000000', // White text
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#FFA726', // Orange for start button
    borderRadius: 30,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    width: width * 0.8,
  },
  startButtonText: {
    color: '#FFFFFF', // White text for start button
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default styles;
