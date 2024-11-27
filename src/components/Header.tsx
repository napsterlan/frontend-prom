import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-xl font-bold">Мой сайт</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/catalog">Каталог</Link>
          </li>
          <li>
            <Link href="/news">Новости</Link>
          </li>
          <li>
            <Link href="/projects">Проекты</Link>
          </li>
          <li>
            <Link href="/info">Информация</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
} 