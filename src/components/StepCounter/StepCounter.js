import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';

const clientId = '208634985017-32vmuk4dosgns59a97m818lipiplmsad.apps.googleusercontent.com';
const scheme = Constants.manifest?.scheme || 'activerecovery';

const StepCounter = () => {
  const [steps, setSteps] = useState(0);

  const fetchGoogleFitData = async (accessToken) => {
    const response = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aggregateBy: [{ dataTypeName: 'com.google.step_count.delta' }],
        bucketByTime: { durationMillis: 86400000 },
        startTimeMillis: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).getTime(),
        endTimeMillis: new Date().getTime(),
      }),
    });
    const result = await response.json();
    const totalSteps = result.bucket
      .map(bucket => bucket.dataset[0].point.reduce((acc, point) => acc + point.value[0].intVal, 0))
      .reduce((acc, steps) => acc + steps, 0);
    setSteps(totalSteps);
  };

  const handlePress = async () => {
    const redirectUri = AuthSession.makeRedirectUri({ scheme });
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=https://www.googleapis.com/auth/fitness.activity.read`;
    const result = await AuthSession.startAsync({ authUrl });

    if (result.type === 'success' && result.params.access_token) {
      fetchGoogleFitData(result.params.access_token);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Connect with Google Fit" onPress={handlePress} />
      <Text>Total steps: {steps}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StepCounter;
