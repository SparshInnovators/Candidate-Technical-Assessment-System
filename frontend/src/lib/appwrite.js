import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

const ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT || '';
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';

const client = new Client();
if (ENDPOINT && PROJECT_ID) client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'assessment_db';
const QUESTIONS_COLLECTION = import.meta.env.VITE_APPWRITE_QUESTIONS_COLLECTION_ID || 'questions';
const ASSESSMENTS_COLLECTION = import.meta.env.VITE_APPWRITE_ASSESSMENTS_COLLECTION_ID || 'assessments';
const RESULTS_COLLECTION = import.meta.env.VITE_APPWRITE_RESULTS_COLLECTION_ID || 'results';
const RESUMES_BUCKET = import.meta.env.VITE_APPWRITE_RESUMES_BUCKET_ID || 'resumes';

export const auth = {
  createAccount: (email, password, name) => account.create(ID.unique(), email, password, name),
  createSession: (email, password) => account.createEmailPasswordSession(email, password),
  getAccount: () => account.get(),
  deleteSession: () => account.deleteSession('current'),
};

export const db = {
  listQuestions: (languages) =>
    databases.listDocuments(DATABASE_ID, QUESTIONS_COLLECTION, [
      Query.equal('language', languages),
      Query.limit(100),
    ]),
  createAssessment: (data) =>
    databases.createDocument(DATABASE_ID, ASSESSMENTS_COLLECTION, ID.unique(), data),
  updateAssessment: (id, data) =>
    databases.updateDocument(DATABASE_ID, ASSESSMENTS_COLLECTION, id, data),
  getAssessment: (id) =>
    databases.getDocument(DATABASE_ID, ASSESSMENTS_COLLECTION, id),
  createResult: (data) =>
    databases.createDocument(DATABASE_ID, RESULTS_COLLECTION, ID.unique(), data),
  getResult: (id) =>
    databases.getDocument(DATABASE_ID, RESULTS_COLLECTION, id),
  listUserResults: (userId) =>
    databases.listDocuments(DATABASE_ID, RESULTS_COLLECTION, [
      Query.equal('userId', userId),
      Query.orderDesc('$createdAt'),
    ]),
};

export const fileStorage = {
  uploadResume: (file) => storage.createFile(RESUMES_BUCKET, ID.unique(), file),
  getFilePreview: (fileId) => storage.getFileView(RESUMES_BUCKET, fileId),
};

export { ID, Query };
