const { dbOp } = require('./databaseMaster');

// Test inserting document
async function testInsert() {
    try {
        const documents = [{name: "TEST", x: 2 }];
        await dbOp('insert', 'Test', {docs: documents});
        console.log('Insert operation successful');
    } catch (error) {
        console.log("Insert operation failed: ", error);
    }
}

async function testFind() {
    try {
        const query = { name: "TEST" };
        const result = await dbOp('find', 'Test', { query });
        console.log('Find operation successful', result);
    } catch(error) {
        console.log('Find operation failed', error);
    }
}

async function testDelete() {
    try {
        const query = { name: "TEST" };
        await dbOp('delete', 'Test', { query });
        console.log('Delete operation successful');
    } catch(error) {
        console.log('Delete operation failed');
    }
}

async function runTests() {
    try {
        await testInsert();
        await testFind();
        await testDelete();
    } catch (error) {
        console.error('An error occured during testing', error);
    }
}

// Execute tasks
runTests().catch(console.error);