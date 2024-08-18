const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const admin = require('firebase-admin');
const { createReadStream, readdirSync } = require('fs');
const { parse } = require('csv-parse');
const path = require('path');

// Initialize the Secret Manager client
const secretClient = new SecretManagerServiceClient();
const projectId = '208634985017'; // Replace with your project ID
const secretId = 'FIREBASE_SERVICE_ACCOUNT_KEY'; // Replace with your secret ID
const secretVersion = 'latest'; // Use 'latest' to get the latest version of the secret

const secretName = `projects/${projectId}/secrets/${secretId}/versions/${secretVersion}`;

async function getSecret() {
  try {
    const [version] = await secretClient.accessSecretVersion({ name: secretName });
    const secretPayload = version.payload.data.toString('utf8');
    return JSON.parse(secretPayload);
  } catch (error) {
    console.error('Failed to access secret:', error);
    throw error;
  }
}

async function initializeFirebase() {
  try {
    const serviceAccount = await getSecret();

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
    throw error;
  }
}

// Helper function to sanitize document ID by removing or replacing invalid characters
function sanitizeDocumentId(id) {
  // Replace slashes and any other invalid characters with underscores
  return id.replace(/[\/]/g, '_');
}

// Helper function to prepare data for Firestore
function prepareDataForFirestore(data) {
  return {
    Nume_Produs: data['Nume Produs'],
    Calorii: data['Calorii'],
    Grasimi: data['Grăsimi'],
    Grasimi_Saturate: data['Grăsimi Saturate'],
    Carbohidrati: data['Carbohidrați'],
    Zaharuri: data['Zaharuri'],
    Fibre: data['Fibre'],
    Proteine: data['Proteine'],
    Sare: data['Sare'],
    Categorie: data['Categorie'],
    Nume_Produs_lower: data['Nume Produs'] ? data['Nume Produs'].toLowerCase() : '',
    Categorie_lower: data['Categorie'] ? data['Categorie'].toLowerCase() : '',
  };
}

// Function to upload data to Firestore with optimized batching
async function uploadDataToFirestore(data) {
  const db = admin.firestore();
  const collectionRef = db.collection('products');
  let batch = db.batch();
  let batchCount = 0;

  for (const item of data) {
    // Skip if Nume_Produs is undefined
    if (!item.Nume_Produs) {
      continue;
    }

    const docId = sanitizeDocumentId(item.Nume_Produs); // Sanitize document ID
    const docRef = collectionRef.doc(docId); // Use sanitized ID
    batch.set(docRef, item);
    batchCount++;

    // Firestore batch limit is 500 operations
    if (batchCount === 500) {
      try {
        await batch.commit();
        console.log('Batch uploaded');
        batch = db.batch();
        batchCount = 0;
      } catch (error) {
        console.error('Batch upload error:', error);
        throw error;
      }
    }
  }

  // Commit the last batch if there are remaining items
  if (batchCount > 0) {
    try {
      await batch.commit();
      console.log('Final batch uploaded');
    } catch (error) {
      console.error('Final batch upload error:', error);
      throw error;
    }
  }
}

async function readAndUploadCSV(filePath) {
  const results = [];
  const parser = parse({ columns: true, delimiter: ',' });
  let undefinedCount = 0;

  createReadStream(filePath)
    .pipe(parser)
    .on('data', (data) => {
      if (!data['Nume Produs']) {
        undefinedCount++;
      } else {
        const item = prepareDataForFirestore(data);
        results.push(item);
      }
    })
    .on('end', async () => {
      console.log(`CSV file ${path.basename(filePath)} read successfully. ${undefinedCount} records with undefined Nume_Produs.`);
      await uploadDataToFirestore(results);
      console.log(`All data from ${path.basename(filePath)} processed and upload initiated.`);
    })
    .on('error', (error) => {
      console.error(`Error reading CSV file ${path.basename(filePath)}:`, error);
      throw error;
    });
}

// Function to process all CSV files in the directory
async function processAllCSVFiles(directory) {
  try {
    const files = readdirSync(directory);
    for (const file of files) {
      if (file.endsWith('.csv')) {
        const filePath = path.join(directory, file);
        console.log(`Processing file: ${filePath}`);
        await readAndUploadCSV(filePath);
      }
    }
    console.log('All files processed successfully');
  } catch (error) {
    console.error('Error processing CSV files:', error);
    throw error;
  }
}

// Initialize Firebase and start processing
initializeFirebase().then(() => {
  const csvDirectory = './../produse'; // Replace with your actual CSV directory path
  console.log(`Starting processing of CSV files in directory: ${csvDirectory}`);
  processAllCSVFiles(csvDirectory).catch(error => {
    console.error('Error during CSV processing:', error);
  });
}).catch(error => {
  console.error('Error initializing Firebase:', error);
});
