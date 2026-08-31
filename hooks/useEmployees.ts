import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { db, EMPLOYEES_COLLECTION } from "@/services/firebase";

export interface Employee {
  id: string;
  alias: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  position: string;
  team: string;
  startDate: string;
  birthday: string;
}

interface UseEmployeesResult {
  employees: Employee[];
  loading: boolean;
  error: string | null;
}

export function useEmployees(): UseEmployeesResult {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, EMPLOYEES_COLLECTION),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            alias: data.alias ?? "",
            firstName: data.firstName ?? "",
            lastName: data.lastName ?? "",
            photoUrl: data.photoUrl ?? "",
            position: data.position ?? "",
            team: data.team ?? "",
            startDate: data.startDate ?? "",
            birthday: data.birthday ?? "",
          };
        });
        setEmployees(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { employees, loading, error };
}
