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
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 15,
    marginTop: 50,
    paddingHorizontal: 15,
    height: 45,
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
  },
  categoryButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
    minWidth: '30%', // Ensure each button has a minimum width
  },
  categoryButtonText: {
    color: '#FFFFFF',
    fontSize: RFValue(14),
    fontWeight: 'bold',
    textAlign: 'center',
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
  foodListWrapper: {
    flex: 1,
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
  mealItem: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#02202B',
    marginVertical: 10,
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
