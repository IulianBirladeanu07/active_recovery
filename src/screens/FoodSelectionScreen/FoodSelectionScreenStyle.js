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
  shadowOpacity: 1,
  shadowRadius: 6,
  elevation: 8,
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
    marginTop: 10,
    paddingHorizontal: 15,
    height: RFValue(50),
    marginBottom: 5,
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
    backgroundColor: colors.unselectedBackground,
    borderWidth: 1,
    borderColor: '#02111B',
    borderRadius: 10,
    marginTop: 20,
    ...shadowStyle,
  },
  categoryButton: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s ease, transform 0.2s ease',
    activeOpacity: 0.8,  // Visual feedback on press
  },
  selectedCategoryButtonText: {
    color: colors.accent,
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  foodListContainer: {
    flex: 1,
    backgroundColor: colors.foodListBackground,
    borderRadius: 10,
    marginVertical: 10,
    paddingBottom: 30,
  },
  underline: {
    height: 3,
    backgroundColor: '#FFA726',
    width: '100%',
    marginBottom: 10,
  },
  headerText: {
    fontSize: RFValue(22),
    color: colors.primaryText,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 40,
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
  categoryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
    option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColor,
  },
  headerContainer: {
    backgroundColor: "#02111B",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8, // Rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },  
  optionText: {
    fontSize: RFValue(16),
    color: colors.primaryText,
  },
});

export default styles;
