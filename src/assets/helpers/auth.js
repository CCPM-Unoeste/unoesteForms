import { auth } from '../services/firebase';

export const signUp = (email, password) => {
    return auth().createUserWithEmailAndPassword(email, password);
}

export const signIn = (email, password) => {
    return auth().signInWithEmailAndPassword(email, password);
}

export const signOut=()=>{
    return auth().signOut();
}

export const isVerified = () => {
    return auth().currentUser.emailVerified;
}

export const sendVerification = () => {
    return auth().currentUser.sendEmailVerification();
}