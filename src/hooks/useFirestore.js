import { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';

const useFirestore = (col) => {
    const[docs, setDocs] = useState([]);

    useEffect(() => {
        const q = query(collection(firestore, col), orderBy("created_at", "desc"));

        const unsucscribe = onSnapshot(q, (snapshot) => {
            let documents = [];
            snapshot.docs.forEach((doc) => {
                documents.push({...doc.data(), id: doc.id})
            }); 
            setDocs(documents);
        })    

        return () => unsucscribe();
    }, [col])

    return { docs };
}

export default useFirestore;