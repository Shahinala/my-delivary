import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc,query, where } from 'firebase/firestore';

import { db, auth } from './firebase';

//........
/*export const saveDelivery = async (deliveries, date, userId) => { 
  try {
    const docRef = await addDoc(collection(db, 'deliveries'), { 
      deliveries, 
      date, 
      userId, // Store the userId
    });
    console.log("Delivery saved successfully with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving delivery:", error.message);
    throw new Error(error.message);
  }
};

export const fetchDeliveries = async (userId) => {
  try {
    const q = query(collection(db, 'deliveries'), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching deliveries:", error.message);
    throw new Error(error.message);
  }
};

export const updateDelivery = async (deliveryId, deliveries, userId) => {
  try {
    const deliveryRef = doc(db, "deliveries", deliveryId);
    const deliverySnap = await getDocs(deliveryRef);

    if (!deliverySnap.exists()) {
      throw new Error("Delivery not found.");
    }

    if (deliverySnap.data().userId !== userId) {
      throw new Error("You are not authorized to edit this delivery.");
    }

    await updateDoc(deliveryRef, { deliveries });
    console.log("Delivery updated successfully!");
  } catch (error) {
    console.error("Error updating delivery:", error.message);
    throw new Error(error.message);
  }
};

/*export const deleteDelivery = async (deliveryId, userId) => {
  try {
    const deliveryRef = doc(db, 'deliveries', deliveryId);
    const deliverySnap = await getDocs(deliveryRef);

    if (!deliverySnap.exists()) {
      throw new Error("Delivery not found.");
    }

    if (deliverySnap.data().userId !== userId) {
      throw new Error("You are not authorized to delete this delivery.");
    }

    await deleteDoc(deliveryRef);
    console.log("Delivery deleted successfully!");
  } catch (error) {
    console.error("Error deleting delivery:", error.message);
    throw new Error(error.message);
  }
};*/


//............
export const saveDelivery = async (deliveries, date) => {
  try {
    const docRef = await addDoc(collection(db, 'deliveries'), { deliveries, date });
    console.log("Delivery saved successfully with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving delivery:", error.message);
    throw new Error(error.message);
  }
};

export const fetchDeliveries = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'deliveries'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching deliveries:", error.message);
    throw new Error(error.message);
  }
};

export const deleteDelivery = async (id) => {
  try {
    await deleteDoc(doc(db, 'deliveries', id));
    console.log("Delivery deleted successfully!");
  } catch (error) {
    console.error("Error deleting delivery:", error.message);
    throw new Error(error.message);
  }
};






// ডেটা আপডেট করা
export const updateDelivery = async (id, deliveries, date) => {
  const deliveryRef = doc(db, "deliveries", id);
  await updateDoc(deliveryRef, {
    deliveries,
    earnings: deliveries * 20,
    date,
  });
};


export { auth };