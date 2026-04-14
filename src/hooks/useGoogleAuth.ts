import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential, signInWithPopup } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../../firebaseConfig';

if (Platform.OS !== 'web') {
  GoogleSignin.configure({
    webClientId: '739969200621-pn2m6ojramofpve7dtmvcu3toecvjjor.apps.googleusercontent.com',
  });
}

export function useGoogleAuth() {
  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === 'web') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const idToken = userInfo.data?.idToken;
        if (idToken) {
          const credential = GoogleAuthProvider.credential(idToken);
          await signInWithCredential(auth, credential);
        }
      }
    } catch (error: any) {
      if (error.code === statusCodes?.SIGN_IN_CANCELLED) {
        console.log('Cancelled');
      } else {
        console.error('Google sign-in error:', error);
      }
    }
  };

  return { signInWithGoogle, request: true };
}