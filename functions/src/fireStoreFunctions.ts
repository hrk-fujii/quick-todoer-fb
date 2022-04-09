import * as functions from "firebase-functions";
const firebase_tools = require("firebase-tools");

/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and have the custom "admin" attribute
 * set to true on the auth token.
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
 
export const recursiveDelete = functions.runWith({
  timeoutSeconds: 540,
  memory: '2GB'
}).https.onCall(async (data, context) => {
  if (!(data.path)) {
    throw new functions.https.HttpsError("invalid-argument", "path is not found");
  } 
  
  // Only allow the id of users document has requested users uid to execute this function.
  if (!(context.auth && context.auth.token && data.path.match("users/" + context.auth.token.uid))) {
    throw new functions.https.HttpsError('permission-denied', "");
  }


  // Run a recursive delete on the given document or collection path.
  // The 'token' must be set in the functions config, and can be generated
  // at the command line by running 'firebase login:ci'.
  await firebase_tools.firestore.delete(data.path, {
    project: process.env.GCLOUD_PROJECT,
    recursive: true,
    yes: true,
    token: functions.config().fb.token,
    force: true
  });

  return {
    path: data.path
  };
});
