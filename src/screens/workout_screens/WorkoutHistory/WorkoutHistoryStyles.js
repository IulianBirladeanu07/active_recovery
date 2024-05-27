import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      padding:5,
      flex: 1,
      backgroundColor: '#02111B',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
      },
    workoutContainer: {
      backgroundColor: '#02111B',
      padding: 15,
      borderRadius: 8,
      marginBottom: 10,
      marginTop: 10,
    },
    timestamp: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 5,
    },
    note: {
      fontSize: 14,
      color: '#FFFFFF',
      marginBottom: 10,
    },
    exerciseContainer: {
      marginBottom: 5,
    },
    exerciseName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 3,
    },
    setContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    setDetails: {
      fontSize: 14,
      color: '#FFFFFF',
    },
});

export default styles;
