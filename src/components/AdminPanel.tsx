import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/utils/auth';

export default function AdminPanel() {
  const router = useRouter();
  const currentPath = router.pathname;

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const getAddUrl = () => {
    const base = currentPath.split('/')[1];
    return `/${base}/add`;
  };

  return (
    <div className="w-full bg-gray-800 text-white px-6 py-1 flex justify-end items-center">
      <nav className="flex space-x-4">
      {!currentPath.includes('auth') && (
        <Link
          href={getAddUrl()}
          className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-md"
        >
          Добавить
        </Link>
      )}
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300"
        >
          Выйти
        </button>

      </nav>
    </div>
  );
} 