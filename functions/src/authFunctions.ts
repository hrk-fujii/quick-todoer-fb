import * as functions from "firebase-functions";
import * as firebaseAuthAdmin from "firebase-admin/auth";
import * as firebaseAuth from "firebase/auth";

export const updatePassword = functions.https.onCall(async (data, context) => {
  const authAdmin = firebaseAuthAdmin.getAuth();
  const auth = firebaseAuth.getAuth();
  
  if (!(data.password && data.newPassword)) {
    throw new functions.https.HttpsError("invalid-argument", "not enough data");
  } 
  
  // Only allow the password verified.
  if (context.auth && context.auth.token && context.auth.token.uid) {
    try {
      const user = await authAdmin.getUser(context?.auth?.token?.uid);
      if (user.email) {
        await firebaseAuth.signInWithEmailAndPassword(auth, user?.email, data?.password);
      } else {
        throw new functions.https.HttpsError('permission-denied', "");
      }
    } catch (error) {
      throw new functions.https.HttpsError('permission-denied', "");
    }
  } else {
    throw new functions.https.HttpsError('permission-denied', "");
  }


  //run update password. 
  try {
    authAdmin.updateUser(context?.auth?.token?.uid, {password: data?.newPassword});
  } catch (error) {
    throw new functions.https.HttpsError("cancelled", "update password faild");
  }
});
