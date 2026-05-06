'use client';

import { useState, useEffect } from 'react';
import { User } from 'lucide-react';

interface UserData {
  user_id: string;
  user_name: string;
  phone: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">用户列表</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="col-span-full text-center text-gray-500">加载中...</p>
        ) : users.map(user => (
          <div key={user.user_id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{user.user_name}</h3>
              <p className="text-sm text-gray-500">ID: {user.user_id}</p>
              <p className="text-sm text-gray-500">电话: {user.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
