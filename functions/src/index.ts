import * as adminApp from "firebase-admin/app";
import * as firebaseApp from "firebase/app";
import * as config from "./config";

adminApp.initializeApp();
firebaseApp.initializeApp(config.firebaseConfig);

export const fireStoreFunctions = require("./fireStoreFunctions");
export const authFunctions = require("./authFunctions");


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
