// Deploy data file to firebase

const data_file = null; // set to null to use main file from package.json
const key_file = './keys/cdr-tool-651e40be417f.json';

import { readFileSync, writeFileSync } from 'node:fs';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue, Filter } from 'firebase-admin/firestore';

async function get_data(file = null) {
    if (file === null) {
        file = JSON.parse(readFileSync('./package.json')).main;
    }
    return (await import(file)).default;
}

const serviceAccount = JSON.parse(readFileSync(key_file));
const cdr = await get_data(data_file);

initializeApp({
  credential: cert(serviceAccount)
});

const db = getFirestore();
console.log(`Connecting to ${db.projectId}`);

const coll = db.collection('settings');

// backup
const snap = await coll.get();
const backup = {};
for (let doc of snap.docs) {
    backup[doc.id] = doc.data();
}
const backup_file = `${db.projectId}_${new Date().toISOString().replaceAll(':', '-')}.mjs`;
console.log(`Backing up to ${backup_file}`)
writeFileSync(backup_file, 'export default ' + JSON.stringify(backup, null, 4) + ';')

for (let [key, val] of Object.entries(cdr)) {
    console.log(`Writing ${key}`);
    await coll.doc(key).set(val);
}
