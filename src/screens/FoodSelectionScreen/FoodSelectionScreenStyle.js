  import { StyleSheet, Dimensions } from 'react-native';
  import { RFValue } from 'react-native-responsive-fontsize';

  const { width, height } = Dimensions.get('window');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#02111B',
      padding: 10,
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
      paddingHorizontal: 20,
      height: 45,
    },
    input: {
      flex: 1,
      paddingVertical: 10,
      color: '#000',
      fontSize: RFValue(14),
    },
    barcodeIcon: {
      color: '#000000',
      padding: 5,
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
      paddingHorizontal: 10,
      marginHorizontal: 5,
      backgroundColor: 'transparent',
      minWidth: '30%', // Ensure each button has a minimum width
    },
    likedCategoryButton: {
      marginLeft: -10, // Slightly move "Liked" to the left
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
      paddingBottom: 5, // Space between text and underline
      alignSelf: 'center',
      width: '100%', // Ensure the underline takes up the entire button width
      borderBottomWidth: 2,
      borderBottomColor: '#FFA726',
    },
      foodListContainer: {
      padding: 5,
      backgroundColor: '#02202B',
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
      width: 45,
      height: 45,
      marginRight: 15,
      borderRadius: 5,
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
