import { StyleSheet } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

// Styles for the HomeScreen
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#02111B',
    marginTop : -20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  recentActivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  stepCounterText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  recentWorkoutContainer: {
    flex: 1,
    marginRight: 10,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentMealContainer: {
    flex: 1,
    marginLeft: 10,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graphContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    alignSelf: 'center',
  },
  summaryText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
  },
  progressBar: {
    width: '100%',
    height: 20,
  },
  mealContainer: {
    flex: 1,
    backgroundColor: '#02202B',
    borderRadius: 10,
    height: 150,
  },
  mealTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  mealScrollView: {
    height: 80, // Fixed height to make the content scrollable within
  },
  foodImage: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  foodName: {
    fontSize: 8,
    color: '#FFFFFF',
  },
  foodNutrient: {
    fontSize: 7,
    color: '#fff',
  },
  foodCalories: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: -20,
  },
  lastWorkoutContainer: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#02202B',
  },
  lastWorkoutScroll: {
    maxHeight: 150,
    paddingLeft: 5, // Padding inside the scrollview for content indention
    paddingRight: 5, // Ensures padding inside the scrollview
  },
  lastWorkoutContent: {
    flexGrow: 1,
  },
  lastWorkoutText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  exerciseContainer: {
    marginBottom: 10,
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  exerciseName: {
    marginLeft: 10,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center'
  },
  bestSetContainer: {
    backgroundColor: '#f7f7f7',
    borderRadius: 5,
    padding: 3,
  },
  bestSetText: {
    fontSize: 8,
    color: '#333',
    alignSelf: 'center'
  },
  noWorkoutsContainer: {
    alignItems: 'center',
  },
  noWorkoutsText: {
    fontSize: 12,
    color: '#fff',
  },
  dropdownContainer: {
    position: 'relative',
  },
  unitSelector: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1000,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    left: 245,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#02111B',
    marginHorizontal: 5,
    marginBottom: 20,
  },
  summaryCardText: {
    fontSize: RFValue(14),
    color: '#FFFFFF',
    marginTop: RFValue(5),
    left: 5,
    textAlign: 'center',
  },
});

export default styles;