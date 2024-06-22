import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { collection, setDoc, getDocs, doc, query, where, orderBy, limit, deleteDoc } from 'firebase/firestore';
import {
  sendWorkoutDataToFirestore,
  getSetsFromLastWorkout,
  countWorkoutsThisWeek,
  getLastWorkout,
  addTemplateToFirestore,
  fetchTemplatesFromFirestore,
  deleteTemplateFromFirestore,
  sendMeasurementsToFirestore,
  fetchLastMeasurements,
  calculate1RM,
} from '../handlers/WorkoutHandler';

jest.mock('firebase/compat/app');
jest.mock('firebase/compat/auth');
jest.mock('firebase/firestore');

describe('Workout Handler', () => {
  const mockUser = { uid: 'test-uid' };

  beforeEach(() => {
    firebase.auth = jest.fn().mockReturnValue({
      currentUser: mockUser,
    });

    setDoc.mockClear();
    getDocs.mockClear();
    doc.mockClear();
    deleteDoc.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send workout data to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValueOnce();
    setDoc.mockImplementation(mockSetDoc);

    const exerciseData = [
        {
          exerciseName: 'Bent-Over Rows',
          sets: [
            { weight: 100, reps: 15, isValidated: true, estimated1RM: 'N/A' },
            { weight: 100, reps: 15, isValidated: true, estimated1RM: 'N/A' },
            { weight: 100, reps: 15, isValidated: true, estimated1RM: 'N/A' },
            { weight: 100, reps: 15, isValidated: true, estimated1RM: 'N/A' },
          ],
        },
      ];
    const inputText = 'Great workout!';
    const isValidationPressed = true;
    const navigation = { replace: jest.fn() };
    const openAnimatedMessage = jest.fn();
    const openModal = jest.fn();
    const formatTime = jest.fn().mockReturnValue('45 mins');
    const elapsedTime = 2700;

    await sendWorkoutDataToFirestore(
      exerciseData,
      inputText,
      isValidationPressed,
      navigation,
      openAnimatedMessage,
      openModal,
      formatTime,
      elapsedTime,
    );

    expect(mockSetDoc).toHaveBeenCalled();
    expect(navigation.replace).toHaveBeenCalledWith('WorkoutDetails', expect.any(Object));
  });

  it('should get sets from last workout', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            exercises: [
              {
                exerciseName: 'Squat',
                sets: [{ weight: '100', reps: '10' }],
              },
            ],
          }),
        },
      ],
    });
    getDocs.mockImplementation(mockGetDocs);

    const sets = await getSetsFromLastWorkout('Squat');
    expect(sets).toEqual(['100 kg x 10']);
  });

  it('should count workouts this week', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce([
      { id: '2023_6_1_10_30_test-uid', data: () => ({}) },
      { id: '2023_6_2_10_30_test-uid', data: () => ({}) },
    ]);
    getDocs.mockImplementation(mockGetDocs);

    const workoutCount = await countWorkoutsThisWeek();
    expect(workoutCount).toBe(2);
  });

  it('should get the last workout', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            uid: 'test-uid',
            exercises: [{ exerciseName: 'Squat', sets: [{ weight: '100', reps: '10' }] }],
          }),
        },
      ],
    });
    getDocs.mockImplementation(mockGetDocs);

    const lastWorkout = await getLastWorkout();
    expect(lastWorkout).toEqual({
      uid: 'test-uid',
      exercises: [{ exerciseName: 'Squat', sets: [{ weight: '100', reps: '10' }] }],
    });
  });

  it('should add a template to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValueOnce();
    setDoc.mockImplementation(mockSetDoc);

    const templateData = { exercises: ['Squat', 'Bench Press'] };
    const templateName = 'full_body';

    await addTemplateToFirestore(templateData, templateName);
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('should fetch templates from Firestore', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [
        {
          data: () => ({
            exercises: ['Squat', 'Bench Press'],
          }),
        },
      ],
    });
    getDocs.mockImplementation(mockGetDocs);

    const templates = await fetchTemplatesFromFirestore();
    expect(templates).toEqual([
      {
        data: {
          exercises: ['Squat', 'Bench Press'],
        },
      },
    ]);
  });

  it('should delete a template from Firestore', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [
        {
          id: 'full_body_test-uid',
          ref: { delete: jest.fn().mockResolvedValueOnce() },
        },
      ],
    });
    getDocs.mockImplementation(mockGetDocs);

    const mockDeleteDoc = jest.fn().mockResolvedValueOnce();
    deleteDoc.mockImplementation(mockDeleteDoc);

    await deleteTemplateFromFirestore('full_body');
    expect(mockDeleteDoc).toHaveBeenCalled();
  });

  it('should send measurements to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValueOnce();
    setDoc.mockImplementation(mockSetDoc);

    const measurements = { weight: 75, height: 175, bodyFat: 15 };

    await sendMeasurementsToFirestore(measurements);
    expect(mockSetDoc).toHaveBeenCalled();
  });

  it('should fetch last measurements', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [
        {
          data: () => ({ uid: 'test-uid', weight: 75, height: 175, bodyFat: 15 }),
        },
      ],
    });
    getDocs.mockImplementation(mockGetDocs);

    const lastMeasurements = await fetchLastMeasurements();
    expect(lastMeasurements).toEqual({ uid: 'test-uid', weight: 75, height: 175, bodyFat: 15 });
  });

  const { diff } = require('deep-diff');

  it('should stress test adding 100 different workout documents to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValue();
    setDoc.mockImplementation(mockSetDoc);
  
    const generateExerciseData = (index) => [
      {
        exerciseName: `Bent-Over Rows ${index}`,
        sets: Array.from({ length: 4 }, () => ({
          weight: 100 + index,
          reps: 15,
          isValidated: true,
          estimated1RM: calculate1RM(100 + index, 15).toFixed(2),
        })),
      },
    ];
  
    const inputText = 'Great workout!';
    const isValidationPressed = true;
    const navigation = { replace: jest.fn() };
    const openAnimatedMessage = jest.fn();
    const openModal = jest.fn();
    const formatTime = jest.fn().mockReturnValue('45 mins');
    const elapsedTime = 2700;
  
    const documents = Array.from({ length: 100 }, (_, i) => ({
      exerciseData: generateExerciseData(i),
      inputText: `${inputText} ${i}`,
      isValidationPressed,
      navigation,
      openAnimatedMessage,
      openModal,
      formatTime,
      elapsedTime,
    }));
  
    const startTime = Date.now();
  
    for (const doc of documents) {
      await sendWorkoutDataToFirestore(
        doc.exerciseData,
        doc.inputText,
        doc.isValidationPressed,
        doc.navigation,
        doc.openAnimatedMessage,
        doc.openModal,
        doc.formatTime,
        doc.elapsedTime,
      );
      expect(mockSetDoc).toHaveBeenCalled();
    }
  
    const endTime = Date.now();
    const duration = endTime - startTime;
  
    console.log(`Added 100 workout documents in ${duration}ms`);
  
    // Verify each document was sent correctly
    documents.forEach((doc, index) => {
      const expectedExerciseData = generateExerciseData(index);
      const expectedData = {
        uid: 'test-uid',
        timestamp: expect.any(String), // Expect any string for timestamp
        note: doc.inputText,
        duration: '45 mins',
        exercises: expectedExerciseData,
      };
  
      const actualCall = mockSetDoc.mock.calls.find(call => {
        const actualData = call[1];
        return actualData.note === doc.inputText &&
               actualData.duration === expectedData.duration &&
               actualData.uid === expectedData.uid &&
               Array.isArray(actualData.exercises) &&
               actualData.exercises.length === expectedData.exercises.length &&
               actualData.exercises.every((exercise, i) => {
                 return exercise.exerciseName === expectedData.exercises[i].exerciseName &&
                        exercise.sets.length === expectedData.exercises[i].sets.length &&
                        exercise.sets.every((set, j) => {
                          return set.weight === expectedData.exercises[i].sets[j].weight &&
                                 set.reps === expectedData.exercises[i].sets[j].reps &&
                                 set.isValidated === expectedData.exercises[i].sets[j].isValidated &&
                                 set.estimated1RM === expectedData.exercises[i].sets[j].estimated1RM;
                        });
               });
      });
  
      if (!actualCall) {
        const actualData = mockSetDoc.mock.calls.find(call => call[1].note === doc.inputText);
        const differences = diff(expectedData, actualData ? actualData[1] : {});
        console.error('Differences:', JSON.stringify(differences, null, 2));
      }
  
      expect(actualCall).toBeDefined();
    });
  
    // Verify that exactly 100 calls were made
    expect(mockSetDoc).toHaveBeenCalledTimes(100);
  });
});