import { useState, useEffect } from 'react';
import { storage, firestore } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const useStorage = (image) => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);

    useEffect(() => {
        const storageRef = ref(storage, `images/${image.name}`);
        const collectionRef = collection(firestore, `images/`);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on('state_changed', (snapshot) => {
            let percentage =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(percentage);
        },
        (err) => {
            setError(err);
        },
        async () => {
            await getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                setUrl(url);
                addDoc(collectionRef, {
                    url: url,
                    created_at: serverTimestamp()
                })
            }
            );
        }
        );
    }, [image]);

    return { url, error, progress }
}

export default useStorage;