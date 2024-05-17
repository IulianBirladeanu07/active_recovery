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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: RFValue(10),
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#02111B',
    marginBottom: RFValue(10),
    marginTop: RFValue(30),
  },
  foodItem: {
    flexDirection: 'row',
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    marginTop: RFValue(10),
  },
  foodDetails: {
    marginLeft: RFValue(15),
  },
  foodName: {
    fontWeight: 'bold',
    fontSize: RFValue(14),
    color: '#fff',
  },
  foodNutrient: {
    fontSize: RFValue(12),
    color: '#fff',
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
    padding: RFValue(10),
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: '#ccc',
  },
  recentSearchText: {
    color: '#fff',
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
});

export default styles;
