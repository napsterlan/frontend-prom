import Link from 'next/link';

export default function Header() {
    return (
        <header className="relative w-full" style={{ height: '160px' }}>
            <div className="bg-[#1A1F2A] h-[80px] flex rounded-b-3xl">
                <div className="flex-1 flex flex-col justify-center text-center text-white">
                    <div className="flex justify-between w-full">
                        <div className="flex flex-col text-left text-xs pl-8">
                            <span>Санкт-Петербург</span>
                            <span>8-812-999-74-20</span>
                            <span>info@promled.com</span>
                        </div>
                        <div className="flex flex-col text-left text-xs pl-4">
                            <span>Москва</span>
                            <span>8-495-744-78-61</span>
                            <span>msk@promled.com</span>
                        </div>
                        <div className="flex flex-col text-left text-xs pl-4">
                            <span>Казахстан</span>
                            <span>8-727-312-34-37</span>
                            <span>kz@promled.com</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <input type="text" placeholder="Поиск..." className="max-w-[350px] w-full px-2 py-1 rounded" />
                </div>
                <div className="flex-1 flex items-center justify-end text-white">
                    <span>8 (800) 550-39-22</span>
                    <a href="https://youtube.com" className="ml-2">YouTube</a>
                    <a href="https://vk.com" className="ml-2">VK</a>
                    <a href="https://telegram.org" className="ml-2">Telegram</a>
                </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.95)] h-[80px] flex">
                <div className="flex-1 max-w-[248px] min-w-[167px] flex items-center pl-8">
                    <img src="/promled.svg" alt="Логотип" className="transition-all duration-300" style={{ height: '60px' }} />
                </div>
                <div className="flex-1 max-w-[1100px] min-w-[873px] flex items-center justify-end">
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
                        <li>
                            <Link href="/contact-us">Связь с нами</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
} 