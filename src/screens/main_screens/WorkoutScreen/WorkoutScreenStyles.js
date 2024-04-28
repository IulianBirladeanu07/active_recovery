import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    paddingBottom: RFValue(10),
  },
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: RFValue(10),
    paddingBottom: RFValue(10),
    paddingTop: RFValue(10),
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: RFValue(28),
    fontWeight: 'bold',
    color: '#fff',
  },
  progressBarContainer: {
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  progressBarValue: {
    fontSize: RFValue(16),
    color: '#fff',
  },
  lastWorkoutContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: RFValue(10),
    marginTop: RFValue(20),
    marginBottom: RFValue(120),
  },
  lastWorkoutText: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginBottom: RFValue(5),
  },
  exerciseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(5),
  },
  exerciseName: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  bestSetContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bestSetText: {
    fontSize: RFValue(14),
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: RFValue(10),
    paddingTop: RFValue(30),
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    marginTop: RFValue(5),
  },
  summaryCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: RFValue(40),
    marginTop: RFValue(0),
  },
  summaryCard: {
    width: width > 400 ? '25%' : '45%', // Adjusts based on screen width
    borderRadius: 10,
    padding: RFValue(10),
    marginBottom: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#008080',
  },
  summaryCardText: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    marginTop: RFValue(5),
    textAlign: 'center',
  },
  summaryCardIcon: {
    width: RFValue(50),
    height: RFValue(50),
    resizeMode: 'contain',
    marginBottom: RFValue(10),
  },
  startButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: RFValue(15),
    alignItems: 'center',
    marginTop: RFValue(10),
  },
  startButtonText: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
});

export default styles;
