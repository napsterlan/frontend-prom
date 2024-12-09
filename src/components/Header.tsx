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
            <div className="bg-[rgba(255,255,255,0.95)] h-[80px] flex justify-center">
                <div className="justify-end flex items-center pl-8">
                    <img src="/promled.svg" alt="Логотип" className="transition-all duration-300 h-[40px]" />
                </div>
                <div className="justify-start flex items-center">
                    <ul className="flex justify-start space-x-4 text-black">
                        <li>
                            <Link href="/catalog" className="px-[15px]">Каталог</Link>
                        </li>
                        <li>
                            <Link href="/news" className="px-[15px]">Новости</Link>
                        </li>
                        <li>
                            <Link href="/about-company" className="px-[15px]">О компании</Link>
                        </li>
                        <li>
                            <Link href="/projects" className="px-[15px]">Реализованные проекты</Link>
                        </li>
                        <li>
                            <Link href="/info" className="px-[15px] ">Информация</Link>
                        </li>
                        <li>
                            <Link href="/services" className="px-[15px]">Услуги</Link>
                        </li>
                        <li>
                            <Link href="/contact-us" className="px-[15px]">Контакты</Link>
                        </li>
                        <li>
                            <Link href="/partners" className="px-[15px]">Партнерам</Link>
                        </li>
                        <li>
                            <Link href="/account" className="w-8 h-8 flex items-center justify-center border-2  border-black rounded-full">
                                <i className="fas fa-user text-gray-600"></i>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </header>
    );
} 