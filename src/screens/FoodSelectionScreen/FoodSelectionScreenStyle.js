// src/screens/FoodSelectionScreenStyle.js
import { StyleSheet, Dimensions } from 'react-native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#02111B',
    paddingBottom: RFValue(10),
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(20),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#02111B',
    marginBottom: RFValue(10),
    marginTop: RFValue(30),
  },
  input: {
    flex: 1,
    padding: RFValue(10),
    color: '#fff',
  },
  barcodeIcon: {
    padding: RFValue(10),
  },
  foodItem: {
    flexDirection: 'row',
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    marginTop: RFValue(10),
    padding: 10,
  },
  foodDetails: {
    marginLeft: RFValue(30),
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    color: '#fff',
  },
  foodNutrient: {
    fontSize: RFValue(10),
    color: '#bbb',
  },
  foodCategories: {
    fontSize: RFValue(12),
    color: '#fff',
    marginTop: RFValue(4),
  },
  recentSearchesTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginVertical: RFValue(10),
    color: '#fff',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
  },
  recentSearchText: {
    color: '#fff',
    fontSize: 12,
    marginRight: 10,
  },
  error: {
    color: 'red',
    marginBottom: RFValue(10),
  },
  scanButton: {
    backgroundColor: '#008080',
    borderRadius: 10,
    padding: RFValue(12),
    alignItems: 'center',
    marginTop: RFValue(10),
  },
  scanButtonText: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  foodImage: {
    width: RFValue(40),
    height: RFValue(40),
    marginRight: RFValue(10),
  },
  recentFoodDetails: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 15,
  },
  toggleButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(10),
  },
  toggleButton: {
    flex: 1,
    padding: RFValue(10),
    marginHorizontal: RFValue(5),
    backgroundColor: '#004D4D',
    borderRadius: 5,
    alignItems: 'center',
  },
  activeToggleButton: {
    backgroundColor: '#008080',
  },
  toggleButtonText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
});

export default styles;
