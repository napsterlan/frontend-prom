import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import type { AuthFormData } from '@/types/types';
import { auth } from '@/utils/auth';

import { login } from '@/api/apiClient';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const data = await login(formData.email, formData.password);

      if (data.success) {
        auth.login(data.data.token);
        router.push('/admin/projects');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (error) {
      setError('Произошла ошибка при входе');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Вход</h1>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-600 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="name"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Пароль</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Войти
          </button>
        </form>
        <p className="mt-4 text-center">
          Нет аккаунта? <Link href="/login/register" className="text-blue-500">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
} 