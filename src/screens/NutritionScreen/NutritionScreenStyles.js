import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#02111B',
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    alignItems: 'center',
    padding: 10,
    marginBottom: 30,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
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
    marginVertical: 10,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: -80,
    paddingHorizontal: 0,
  },
  innerProgressItem: {
    alignItems: 'center',
  },
  innerProgressText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 5,
  },
  barContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginTop: 40,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  totalCaloriesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  mealContainer: {
    width: '100%',
    backgroundColor: '#02202B',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    height: 250, // Fixed height
  },
  mealTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  mealScrollView: {
    flexGrow: 1, // Ensure ScrollView content container grows to fill space
  },
  foodImage: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
  foodName: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  foodNutrient: {
    fontSize: 14,
    color: '#CCCCCC',
  },
  foodCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
    top: 10,
  },
});

export default styles;
