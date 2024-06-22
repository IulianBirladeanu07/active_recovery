import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { collection, setDoc, getDocs, getDoc, deleteDoc, doc } from 'firebase/firestore';
import { addDocument, fetchDocuments, fetchDocument, deleteDocument } from '../handlers/nutritionHandler';  // Update with the correct path

jest.mock('firebase/compat/app');
jest.mock('firebase/compat/auth');
jest.mock('firebase/firestore');

describe('Nutrition Handler', () => {
  const mockUser = { uid: 'test-uid' };
  const collectionName = 'testCollection';
  const docId = 'testDoc';
  const data = { name: 'Apple', calories: 52 };

  beforeEach(() => {
    firebase.auth = jest.fn().mockReturnValue({
      currentUser: mockUser,
    });

    setDoc.mockClear();
    getDocs.mockClear();
    getDoc.mockClear();
    deleteDoc.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add a document to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValueOnce();
    setDoc.mockImplementation(mockSetDoc);

    const mockDoc = { id: docId };
    doc.mockReturnValue(mockDoc);

    await addDocument(collectionName, docId, data);
    expect(mockSetDoc).toHaveBeenCalledWith(mockDoc, { ...data, uid: 'test-uid' });
  });

  it('should fetch documents from Firestore', async () => {
    const mockGetDocs = jest.fn().mockResolvedValueOnce({
      docs: [{ id: '1', data: () => ({ ...data, uid: 'test-uid' }) }],
    });
    getDocs.mockImplementation(mockGetDocs);

    const documents = await fetchDocuments(collectionName);
    expect(documents).toEqual([{ id: '1', ...data, uid: 'test-uid' }]);
  });

  it('should fetch a document from Firestore', async () => {
    const mockGetDoc = jest.fn().mockResolvedValueOnce({
      exists: () => true,
      id: '1',
      data: () => ({ ...data, uid: 'test-uid' }),
    });
    getDoc.mockImplementation(mockGetDoc);

    const document = await fetchDocument(collectionName, docId);
    expect(document).toEqual({ id: '1', ...data, uid: 'test-uid' });
  });

  it('should delete a document from Firestore', async () => {
    const mockGetDoc = jest.fn().mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ ...data, uid: 'test-uid' }),
    });
    const mockDeleteDoc = jest.fn().mockResolvedValueOnce();
    getDoc.mockImplementation(mockGetDoc);
    deleteDoc.mockImplementation(mockDeleteDoc);

    const mockDoc = { id: docId };
    doc.mockReturnValue(mockDoc);

    await deleteDocument(collectionName, docId);
    expect(mockDeleteDoc).toHaveBeenCalledWith(mockDoc);
  });

  it('should stress test adding 100 documents to Firestore', async () => {
    const mockSetDoc = jest.fn().mockResolvedValue();
    setDoc.mockImplementation(mockSetDoc);

    const documents = Array.from({ length: 100 }, (_, i) => ({
      docId: `${docId}-${i}`,
      data: { ...data, name: `Apple-${i}` },
    }));

    const startTime = Date.now();

    for (const { docId, data } of documents) {
      const mockDoc = { id: docId };
      doc.mockReturnValue(mockDoc);

      await addDocument(collectionName, docId, data);
      expect(mockSetDoc).toHaveBeenCalledWith(mockDoc, { ...data, uid: 'test-uid' });
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    console.log(`Added 100 documents in ${duration}ms`);
  });
});
