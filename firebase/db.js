import { db } from "./config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const getUsers = async () => {
  const data = await getDocs(collection(db, "users"));
  data.docs.map((doc) => {
    console.log(doc.data(), doc.id);
  });
  return data.docs;
};

export const createUser = async (name, age) => {
  await addDoc(collection(db, "users"), { name, age });
};

export const updateUser = async (id, age) => {
  const userDoc = doc(db, "users", id);
  const newFields = { age: age + 1 };
  await updateDoc(userDoc, newFields);
};

export const deleteUser = async (id) => {
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);
};
