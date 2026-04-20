import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

const addUserIdFilter = (constraints, userId) => [
  where("userId", "==", userId),
  ...constraints,
];

export const createRecord = async (collectionName, payload, userId) => {
  const data = { ...payload, userId, createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  const ref = await addDoc(collection(db, collectionName), data);
  return ref.id;
};

export const updateRecord = async (collectionName, id, payload) => {
  await updateDoc(doc(db, collectionName, id), { ...payload, updatedAt: serverTimestamp() });
};

export const deleteRecord = async (collectionName, id) => {
  await deleteDoc(doc(db, collectionName, id));
};

export const listRecords = async (collectionName, userId, sortBy = "createdAt", sortDir = "desc") => {
  const q = query(collection(db, collectionName), ...addUserIdFilter([], userId));
  const snapshot = await getDocs(q);
  const rows = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  return rows.sort((a, b) => {
    const aDate = toJsDate(a[sortBy]).getTime();
    const bDate = toJsDate(b[sortBy]).getTime();
    return sortDir === "asc" ? aDate - bDate : bDate - aDate;
  });
};

export const listRecordsByField = async (collectionName, userId, field, op, value) => {
  const q = query(collection(db, collectionName), ...addUserIdFilter([where(field, op, value)], userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const getRecord = async (collectionName, id) => {
  const snapshot = await getDoc(doc(db, collectionName, id));
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
};

export const toJsDate = (value) => {
  if (value instanceof Timestamp) return value.toDate();
  if (typeof value?.toDate === "function") return value.toDate();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  return new Date();
};
