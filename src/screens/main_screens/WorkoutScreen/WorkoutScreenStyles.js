import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 15,
    backgroundColor: '#02111B',
  },
  headerContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: RFValue(24),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    marginBottom: RFValue(10),
    alignItems: 'center',
  },
  progressBarValue: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
  },
  lastWorkoutContainer: {
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: RFValue(10),
    marginTop: RFValue(20),
    height: RFValue(165), // Set height to match maxHeight
    overflow: 'hidden', // Ensure content is clipped to the container bounds
  },
  lastWorkoutScroll: {
    flex: 1,
  },
  lastWorkoutContent: {
    flexGrow: 1, // Ensure content is scrollable
    paddingBottom: RFValue(10),
  },
  lastWorkoutText: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: RFValue(5),
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(5),
  },
  circularProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  exerciseName: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bestSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestSetText: {
    fontSize: RFValue(14),
    color: '#FFFFFF'
  },
  noWorkoutsText: {
    fontSize: RFValue(18),
    color: '#A0AEC0',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: RFValue(10),
    paddingTop: RFValue(30),
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#005050',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  summaryCardText: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    marginTop: RFValue(5),
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#29335c',
    borderRadius: 10,
    padding: RFValue(15),
    alignItems: 'center',
    marginTop: RFValue(75),
    marginBottom: -15,
  },
  startButtonText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
});

export default styles;
