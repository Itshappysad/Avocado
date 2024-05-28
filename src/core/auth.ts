import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { app } from '../../firebase.config';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

auth.useDeviceLanguage();

export async function createUserWithEmail(email: string, password: string) {
  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const user = credential.user;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function singin(email: string, password: string) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const user = credential.user;
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function signInWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    return credential.user;
  } catch (error) {
    console.error(error);
    return null;
  }
}
