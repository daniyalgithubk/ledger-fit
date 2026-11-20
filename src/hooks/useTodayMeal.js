import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

import { db } from "../firebase";


const sum = (arr, fn) => arr.reduce((t, x) => t + (Number(fn(x)) || 0), 0);

export function useTodayMeals(uid) {
    const [meals , setmeals] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState("");

    useEffect(() => {
    if (!uid) {
      setMeals([]);
      setLoading(false);
      return;
    }

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", uid, "meals"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setMeals(
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data({ serverTimestamps: "estimate" }),
          }))
        );
        setLoading(false);
      },
      (e) => {
        console.error(e);
        setError("Could not load today's meals.");
        setLoading(false);
      }
    );

    return unsub;
  }, [uid]);

  const totals = useMemo(
    () => ({
      calories: sum(meals, (m) => m.totalCalories),
      protein: sum(meals, (m) => m.totalProtein ?? sum(m.items || [], (i) => i.protein)),
      carbs: sum(meals, (m) => m.totalCarbs ?? sum(m.items || [], (i) => i.carbs)),
      fat: sum(meals, (m) => m.totalFat ?? sum(m.items || [], (i) => i.fat)),
    }),
    [meals]
  );

  const removeMeal = async (id) => {
    await deleteDoc(doc(db , "users", uid, "meals", id));
  };

  return { meals, totals, loading, error, removeMeal };
}