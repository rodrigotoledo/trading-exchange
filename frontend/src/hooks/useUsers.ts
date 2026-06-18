import { useState, useEffect } from 'react';
import { generateFakeUsers, updateFakeUsersValues } from '../services/faker.service';
import type { User } from '../types';

export const useUsers = (count: number = 10) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUsers(generateFakeUsers(count));
    setLoading(false);

    const interval = setInterval(() => {
      setUsers((currentUsers) => updateFakeUsersValues(currentUsers));
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return { users, loading };
};
