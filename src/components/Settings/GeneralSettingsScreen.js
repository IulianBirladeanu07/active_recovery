    import React from 'react';
    import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';

    const GeneralSettingsScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.header}>General Settings</Text>

        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.switchContainer}>
            <Text style={styles.item}>Meal Notifications</Text>
            <Switch />
        </View>
        <View style={styles.switchContainer}>
            <Text style={styles.item}>Workout Notifications</Text>
            <Switch />
        </View>
        <View style={styles.switchContainer}>
            <Text style={styles.item}>General Notifications</Text>
            <Switch />
        </View>

        <Text style={styles.sectionHeader}>Data & Privacy</Text>
        <TouchableOpacity onPress={() => navigation.navigate('DataDeletion')}>
            <Text style={styles.item}>Delete Account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Units')}>
            <Text style={styles.item}>Units</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Theme')}>
            <Text style={styles.item}>Theme</Text>
        </TouchableOpacity>
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#02111B',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginTop: 20,
        marginBottom: 10,
    },
    item: {
        fontSize: 16,
        color: '#CCCCCC',
        paddingVertical: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    });

    export default GeneralSettingsScreen;
