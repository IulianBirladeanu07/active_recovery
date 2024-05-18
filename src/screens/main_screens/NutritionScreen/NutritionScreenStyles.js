import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  dailyNutritionContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  nutritionDetails: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  nutritionLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  weightGoalContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  weightGoalLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  trackWeightButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  trackWeightButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  waterIntakeContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  waterIntakeLabel: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  logWaterButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  logWaterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  viewRecipesButton: {
    backgroundColor: '#e71d27',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
  },
  viewRecipesButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  suggestedRecipesContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  recipeCard: {
    width: width > 400 ? '30%' : '45%', // Adjusts based on screen width
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 5,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  mealsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  mealCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  mealDetails: {
    fontSize: 16,
    color: '#000',
  },
  progressBarContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
    marginBottom : 200,
  },
  progressBar: {
    flexDirection: 'row',
    height: 100,
    width: 100,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    overflow: 'hidden', // Ensure that child elements respect the border radius
  },
  progressBarFill: {
    backgroundColor: '#e71d27',
    flex: 1, // Fills available space
    borderRadius: 10,
  },
  progressBarValue: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default styles;
