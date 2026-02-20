import { databases, storage } from './appwrite.js';
import { Permission, Role } from 'node-appwrite';

const DATABASE_ID = 'assessment_db';

const COLLECTIONS = {
    questions: 'questions',
    assessments: 'assessments',
    results: 'results',
};

const BUCKET_ID = 'resumes';

async function createDatabase() {
    try {
        await databases.create(DATABASE_ID, 'Assessment Database');
        console.log('✓ Database created: assessment_db');
    } catch (err) {
        if (err.code === 409) {
            console.log('• Database already exists, skipping...');
        } else {
            throw err;
        }
    }
}

async function tryCreateAttribute(fn, name) {
    try {
        await fn();
    } catch (err) {
        if (err.code === 409) return;
        console.error(`  ✗ Attribute "${name}" failed:`, err.message);
        throw err;
    }
}

async function ensureCollection(id, name, permissions) {
    try {
        await databases.createCollection(DATABASE_ID, id, name, permissions);
        console.log(`✓ Collection created: ${id}`);
    } catch (err) {
        if (err.code === 409) {
            console.log(`• Collection ${id} already exists, updating permissions...`);
            await databases.updateCollection(DATABASE_ID, id, name, permissions);
        } else {
            throw err;
        }
    }
}

async function createQuestionsCollection() {
    const id = COLLECTIONS.questions;
    await ensureCollection(id, 'Questions', [Permission.read(Role.any())]);

    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'questionText', 1024, true), 'questionText');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'options', 512, true, undefined, true), 'options');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'correctAnswer', true), 'correctAnswer');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'language', 64, true), 'language');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'difficulty', 32, false, 'medium'), 'difficulty');
    console.log('  ✓ Attributes ensured for questions');

    await new Promise((r) => setTimeout(r, 3000));

    try {
        await databases.createIndex(DATABASE_ID, id, 'idx_language', 'key', ['language']);
        console.log('  ✓ Index created: idx_language');
    } catch (err) {
        if (err.code === 409) console.log('  • Index idx_language already exists');
        else throw err;
    }
}

async function createAssessmentsCollection() {
    const id = COLLECTIONS.assessments;
    await ensureCollection(id, 'Assessments', [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
    ]);

    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'userId', 128, true), 'userId');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'languages', 64, true, undefined, true), 'languages');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'questionIds', 128, true, undefined, true), 'questionIds');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'answers', false, undefined, undefined, undefined, true), 'answers');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'currentIndex', false, 0), 'currentIndex');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'score', false, 0), 'score');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'status', 32, false, 'in_progress'), 'status');
    await tryCreateAttribute(() => databases.createDatetimeAttribute(DATABASE_ID, id, 'startedAt', false), 'startedAt');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'timePerQuestion', false, 60), 'timePerQuestion');
    console.log('  ✓ Attributes ensured for assessments');

    await new Promise((r) => setTimeout(r, 3000));

    try {
        await databases.createIndex(DATABASE_ID, id, 'idx_userId', 'key', ['userId']);
        console.log('  ✓ Index created: idx_userId');
    } catch (err) {
        if (err.code === 409) console.log('  • Index idx_userId already exists');
        else throw err;
    }
}

async function createResultsCollection() {
    const id = COLLECTIONS.results;
    await ensureCollection(id, 'Results', [
        Permission.read(Role.users()),
        Permission.create(Role.users()),
    ]);

    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'userId', 128, true), 'userId');
    await tryCreateAttribute(() => databases.createStringAttribute(DATABASE_ID, id, 'assessmentId', 128, true), 'assessmentId');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'score', true), 'score');
    await tryCreateAttribute(() => databases.createIntegerAttribute(DATABASE_ID, id, 'totalQuestions', true), 'totalQuestions');
    await tryCreateAttribute(() => databases.createFloatAttribute(DATABASE_ID, id, 'percentage', true), 'percentage');
    await tryCreateAttribute(() => databases.createBooleanAttribute(DATABASE_ID, id, 'passed', true), 'passed');
    await tryCreateAttribute(() => databases.createDatetimeAttribute(DATABASE_ID, id, 'completedAt', true), 'completedAt');
    console.log('  ✓ Attributes ensured for results');
}

async function createResumesBucket() {
    try {
        await storage.createBucket(
            BUCKET_ID,
            'Resumes',
            [Permission.read(Role.users()), Permission.create(Role.users())],
            false,
            undefined,
            undefined,
            ['pdf', 'doc', 'docx'],
        );
        console.log('✓ Storage bucket created: resumes');
    } catch (err) {
        if (err.code === 409) {
            console.log('• Bucket resumes already exists, updating permissions...');
            await storage.updateBucket(
                BUCKET_ID,
                'Resumes',
                [Permission.read(Role.users()), Permission.create(Role.users())],
            );
        } else {
            throw err;
        }
    }
}

async function main() {
    console.log('\n🚀 Setting up Appwrite resources...\n');

    try {
        await createDatabase();
        await createQuestionsCollection();
        await createAssessmentsCollection();
        await createResultsCollection();
        await createResumesBucket();

        console.log('\n✅ Setup complete! All resources created successfully.\n');
    } catch (err) {
        console.error('\n❌ Setup failed:', err.message);
        process.exit(1);
    }
}

main();
