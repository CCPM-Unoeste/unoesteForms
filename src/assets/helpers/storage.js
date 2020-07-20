import { storage } from '../services/firebase';

export const recordImage = (ref, data) => {
    return storage.ref().child(ref).putString(data, 'data_url', { contentType: 'image/jpg' });
}

export const retrieveDownloadURL = ref => {
    return storage.ref(ref).getDownloadURL();
}

export const removeImage = ref => {
    const imageRef=storage.ref(ref);
    return imageRef.delete();
}