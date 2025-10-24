import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class FirebaseTestService {
  constructor(private firestore: Firestore) {}

  async addTestDoc() {
    const ref = collection(this.firestore, 'test');
    const docRef = await addDoc(ref, { message: 'Hello Firebase!', created: new Date() });
    console.log('✅ Document added with ID:', docRef.id);
  }

  async getTestDocs() {
    const ref = collection(this.firestore, 'test');
    const snapshot = await getDocs(ref);
    console.log('📄 Documents:', snapshot.docs.map(d => d.data()));
  }
}
