import * as functions from "firebase-functions";
import * as firebaseAuthAdmin from "firebase-admin/auth";
import * as firebaseAuth from "firebase/auth";


export const updatePassword = functions.
runWith({
  timeoutSeconds: 540,
  memory: '2GB'
}).https.onCall(async (data, context) => {
  const authAdmin = firebaseAuthAdmin.getAuth();
  const auth = firebaseAuth.getAuth();
  
  if (!(data.password)) {
    throw new functions.https.HttpsError("invalid-argument", "password is not found");
  }
  if (!(data.newPassword)) {
    throw new functions.https.HttpsError("invalid-argument", "newPassword is not found");
  }
  
  // Only allow the password verified.
  if (context.auth && context.auth.token && context.auth.token.uid) {
    try {
      const user = await authAdmin.getUser(context?.auth?.token?.uid);
      if (user.email) {
        await firebaseAuth.signInWithEmailAndPassword(auth, user?.email, data?.password);
      } else {
        throw new functions.https.HttpsError('permission-denied', "authentication failed");
      }
    } catch (error) {
      throw new functions.https.HttpsError('permission-denied', "authentication failed");
    }
  } else {
    throw new functions.https.HttpsError('permission-denied', "authentication failed");
  }


  //run update password. 
  try {
    authAdmin.updateUser(context?.auth?.token?.uid, {password: data?.newPassword});
  } catch (error) {
    throw new functions.https.HttpsError("cancelled", "update password failed");
  }
});

export const updateEmail = functions.
runWith({
  timeoutSeconds: 540,
  memory: '2GB'
}).https.onCall(async (data, context) => {
  const authAdmin = firebaseAuthAdmin.getAuth();
  const auth = firebaseAuth.getAuth();
  
  if (!(data.newEmail)) {
    throw new functions.https.HttpsError("invalid-argument", "newEmail is not found");
  }
  if (!(data.password)) {
    throw new functions.https.HttpsError("invalid-argument", "password is not found");
  }
  
  // Only allow the password verified.
  if (context.auth && context.auth.token && context.auth.token.uid) {
    try {
      const user = await authAdmin.getUser(context?.auth?.token?.uid);
      if (user.email) {
        await firebaseAuth.signInWithEmailAndPassword(auth, user?.email, data?.password);
      } else {
        throw new functions.https.HttpsError('permission-denied', "authentication failed");
      }
    } catch (error) {
      throw new functions.https.HttpsError('permission-denied', "authentication failed");
    }
  } else {
    throw new functions.https.HttpsError('permission-denied', "authentication failed");
  }


  //run update email-address. 
  try {
    if (auth.currentUser) {
      await firebaseAuth.updateEmail(auth.currentUser, data?.newEmail);
    } else {
      throw new functions.https.HttpsError('permission-denied', "authentication failed");
    }
  } catch (error) {
    throw new functions.https.HttpsError("cancelled", "update email failed");
  }
});
