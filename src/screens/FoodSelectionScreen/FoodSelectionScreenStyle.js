import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    padding: 10,
  },
  overlayContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
    paddingHorizontal: 15,
    height: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    
  },
  input: {
    flex: 1,
    paddingVertical: 0,
    paddingHorizontal: 10,
    fontSize: RFValue(14),
    color: '#000',
  },
  searchIcon: {
    color: '#aaa',
    marginRight: 10,
  },
  barcodeIcon: {
    color: '#000',
    padding: 10,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust to 'space-around' or 'space-evenly' if needed
    marginBottom: 15,
    marginTop: 15,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12, // Increased border radius for a more rounded look
    borderWidth: 2,
    borderColor: '#CCCCCC', // Default border color
    backgroundColor: 'transparent',
    backgroundColor: '#1E2A33', // Slight background color for unselected state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5, // Added letter spacing for a polished look
  },
  selectedCategoryButton: {
    borderColor: '#FFA726', // Highlight border color for the selected category
    backgroundColor: '#03323C', // Darker background for selected state
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }], // Slight scaling effect for the selected state
  },
  selectedCategoryButtonText: {
    color: '#FFA726',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: '#FFA726',
  },
  foodListContainer: {
    padding: 5,
    backgroundColor: '#02222B',
    borderRadius: 10,
    marginVertical: 10,
    
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    backgroundColor: '#02202B',
    borderRadius: 10,
  },
  foodImage: {
    width: 35,
    height: 35,
    marginRight: 15,
    borderRadius: 5,
  },
  foodCalories: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
    color: '#FFFFFF',
    marginBottom: 5,
  },
  foodNutrient: {
    fontSize: RFValue(12),
    color: '#CCCCCC',
    marginBottom: 5,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  macroBox: {
    backgroundColor: '#02111B',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 70,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: RFValue(10),
    color: '#CCCCCC',
  },
  macroValue: {
    fontSize: RFValue(12),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  firstFoodItem: {
    padding: 15,
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: RFValue(16),
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealFood: {
    paddingVertical: 5,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  infoText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    textAlign: 'center',
    marginTop: 10,
  },
  showMoreText: {
    color: '#FFA726',
    textAlign: 'center',
    marginTop: 10,
    fontSize: RFValue(14),
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
  },
  doneButtonContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000, // Ensure it's on top of other components
  },
  doneButton: {
    backgroundColor: '#FFA726',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
});

export default styles;
