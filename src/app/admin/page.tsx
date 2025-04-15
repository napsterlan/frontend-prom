'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link';

export default function AdminDashboard() {
    const { data: session, status } = useSession()


  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
    //   console.log(session)
      console.log(status)
      // router.push('/auth/error?error=AccessDenied')
    }
  }, [status, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session?.user) {
    return null
  }
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Дашборд администратора</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="relative border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Категории реализованных проектов</h2>
          <Link href="/admin/project-catalog" className="block mt-2 text-blue-500">
            Перейти
          </Link>
          <Link href="/admin/project-catalog/add" className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded flex items-center justify-center w-8 h-8">
            +
          </Link>
        </div>
        <div className="relative border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Реализованные проекты</h2>
          <Link href="/admin/projects" className="block mt-2 text-blue-500">
            Перейти
          </Link>
          <Link href="/admin/projects/add" className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded flex items-center justify-center w-8 h-8">
            +
          </Link>
        </div>
        <div className="relative border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Новости</h2>
          <Link href="/admin/news" className="block mt-2 text-blue-500">
            Перейти
          </Link>
          <Link href="/admin/news/add" className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded flex items-center justify-center w-8 h-8">
            +
          </Link>
        </div>
        <div className="relative border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">Пользователи</h2>
          <Link href="/admin/users" className="block mt-2 text-blue-500">
            Перейти
          </Link>
          <Link href="/admin/users/add" className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded flex items-center justify-center w-8 h-8">
            +
          </Link>
        </div>
        <div className="relative border rounded-lg p-4 bg-white shadow">
          <h2 className="text-xl font-semibold">BIM конвертор</h2>
          <Link href="/admin/bim-convertor" className="block mt-2 text-blue-500">
            Перейти
          </Link>
        </div>
      </div>
    </div>
  );
}
