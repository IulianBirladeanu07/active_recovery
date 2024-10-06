import { StyleSheet, Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

// Centralized color palette for reusability
const colors = {
  background: '#02111B',
  borderColor: '#02111B',
  primaryText: '#FFFFFF',
  accent: '#FFA726',
  shadow: '#000',
  unselectedBackground: '#02111B',
  selectedBackground: '#03323C',
  inputBackground: '#FFFFFF',
  foodItemBackground: '#02202B',
  foodListBackground: '#02222B',
  nutrientText: '#CCCCCC',
  macroBoxBackground: '#02111B',
};

// Centralized shadow and elevation style
const shadowStyle = {
  shadowColor: colors.shadow,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 4,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  overlayContainer: {
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 10,
    backgroundColor: colors.inputBackground,
    marginTop: 50,
    paddingHorizontal: 15,
    height: RFValue(50),
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
    justifyContent: 'space-between',
    marginBottom: 15,
    marginTop: 15,
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderColor,
    backgroundColor: colors.unselectedBackground,
    ...shadowStyle,
    transform: [{ scale: 1 }], // Default scale
    transition: 'transform 0.2s ease', // Smooth transition
  },
  // Selected style
  selectedCategoryButton: {
    borderColor: colors.accent,
    backgroundColor: colors.selectedBackground,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 6,
    transform: [{ scale: 1.05 }], // Slightly larger when selected
  },
  // New hover effect (if using a library like React Native Reanimated)
  categoryButtonHover: {
    transform: [{ scale: 1.1 }], // Scale up on hover
  },
  categoryButtonText: {
    color: colors.primaryText,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  selectedCategoryButtonText: {
    color: colors.accent,
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
    paddingBottom: 5,
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  foodListContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: colors.foodListBackground,
    borderRadius: 10,
    marginVertical: 10,
    marginBottom: 20,
    paddingBottom: 30,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    backgroundColor: colors.foodItemBackground,
    borderRadius: 10,
  },
  foodImage: {
    width: RFValue(35),
    height: RFValue(35),
    marginRight: 15,
    borderRadius: 5,
  },
  foodCalories: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
    color: colors.primaryText,
    textAlign: 'right',
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: RFValue(16),
    color: colors.primaryText,
    marginBottom: 5,
    justifyContent: 'space-between'
  },
  foodNutrient: {
    fontSize: RFValue(12),
    color: colors.nutrientText,
    marginBottom: 5,
  },
  macroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  macroBox: {
    backgroundColor: colors.macroBoxBackground,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: 70,
    alignItems: 'center',
  },
  macroLabel: {
    fontSize: RFValue(10),
    color: colors.nutrientText,
  },
  macroValue: {
    fontSize: RFValue(12),
    color: colors.primaryText,
    fontWeight: 'bold',
  },
  firstFoodItem: {
    padding: 15,
    borderRadius: 10,
  },
  mealTitle: {
    fontSize: RFValue(16),
    color: colors.primaryText,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  mealFood: {
    paddingVertical: 5,
    borderBottomColor: '#444',
    borderBottomWidth: 1,
  },
  infoText: {
    color: colors.primaryText,
    fontSize: RFValue(14),
    textAlign: 'center',
    marginTop: 10,
  },
  showMoreText: {
    color: colors.accent,
    textAlign: 'center',
    marginTop: 10,
    fontSize: RFValue(14),
  },
  loadingOverlay: {
    ...shadowStyle,
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
    zIndex: 1000,
  },
  doneButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  doneButtonText: {
    color: colors.primaryText,
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: colors.accent,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    zIndex: 10, // Ensure FAB is on top
  },
  
  // Options container when FAB expands
  expandedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    zIndex: 9,  // Below the FAB but above the rest of the screen
    ...shadowStyle,
  },
  
  // Floating options container, for the hidden options when FAB is clicked
  fabOptionsContainer: {
    position: 'absolute',
    bottom: 100,  // Positioned above the FAB
    right: 20,
    backgroundColor: colors.foodItemBackground,
    borderRadius: 10,
    padding: 10,
    zIndex: 9,  // Below the FAB but above other elements
    ...shadowStyle,
  },
  
  optionButton: {
    backgroundColor: colors.selectedBackground,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadowStyle,
  },
  
  optionButtonText: {
    color: colors.primaryText,
    fontSize: RFValue(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Options for individual actions in expanded mode
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  optionText: {
    fontSize: RFValue(16),
    color: colors.primaryText,
  },
});

export default styles;
