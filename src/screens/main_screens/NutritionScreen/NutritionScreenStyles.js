import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#02111B',
  },
  scrollContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginBottom: 110,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  circularProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  mealSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#005050',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  selectedMealButton: {
    backgroundColor: '#008080',
  },
  mealButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  addButton: {
    flex: 1,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    left: 5,
  },
  totalCaloriesText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  mealContainer: {
    flex: 1,
    marginTop: 5,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    marginTop: 5,
    left: 10,
  },
  mealScrollView: {
    height: 150, // Fixed height to make the content scrollable within
  },
  foodImage: {
    width: 30,
    height: 30,
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
  },
});

export default styles;
