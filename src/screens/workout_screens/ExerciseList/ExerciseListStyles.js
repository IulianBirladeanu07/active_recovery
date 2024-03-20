import { StyleSheet } from 'react-native';

const exerciseListStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#02111B',
  },
  headerContainer: {
    marginBottom: 24,
    marginTop: 20,
    alignSelf: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdf5ec',
  },
  listContainer: {
    paddingBottom: 16,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fdf5ec',
    marginBottom: 20,
    left: 12,
  },
  exerciseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  exerciseImage: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 16,
    color: '#fdf5ec',
  },
});

export default exerciseListStyles;
