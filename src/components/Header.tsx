import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/utils/auth';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
  
    useEffect(() => {
        setIsAuthenticated(auth.isAuthenticated());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const navigationElement = document.getElementById('navigation');
            if (!navigationElement) return;
            
            const navigationOffset = navigationElement.offsetTop;
            const navigationOffsetBottom = navigationElement.offsetTop + navigationElement.offsetHeight;
            const scrollPosition = window.scrollY;
            let status = 0;
            console.clear();
            console.log(navigationOffset);
            console.log(navigationOffsetBottom);
            console.log(scrollPosition);
            console.log(isSticky);
            if (!isSticky && document.getElementById('navigation-fakebox')) {
                setIsSticky(scrollPosition > navigationOffset);
            } else {
                setIsSticky(scrollPosition < navigationOffsetBottom);
            }


        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        auth.logout();
        setIsAuthenticated(false);
        router.push('/login');
    };
    const button = "px-[5px]  py-[2px] font-normal border-2 border-transparent text-[14px] rounded-[10px] hover:border-PLGreen font-commissioner";
    const catalogButton = "bg-[#f0f0f0] px-[10px]  py-[2px] [&>*]:border-0 s border-2 border-[#f0f0f0] hover:border-PLGreen rounded-[10px] flex";

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
            {isSticky ? <div id='navigation-fakebox' style={{ height: '80px' }} /> : ''}
            <div id="navigation" className={`bg-[rgba(255,255,255,0.95)] h-[80px] flex justify-center
                ${isSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : ''}`}>

                <div className="justify-end flex items-center pr-8">
                    <img src="/promled.svg" alt="Логотип" className="transition-all duration-300 h-[40px]" />
                </div>
                <div className="justify-start flex items-center">
                    <ul className="flex justify-start space-x-4 text-black items-center font-commissioner">
                        <li className={catalogButton} >
                            <div className="flex items-center gap-2">
                                <div className="grid grid-cols-3 gap-[4px]">
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                    <div className="w-[2px] h-[2px] bg-black rounded-full"></div>
                                </div>
                            </div>
                            <Link style={{paddingLeft: '10px'}} href="/catalog" className={button}>Каталог</Link>
                        </li>
                        <li>
                            <Link href="/news" className={button}>Новости</Link>
                        </li>
                        <li>
                            <Link href="/about-company" className={button}>О компании</Link>
                        </li>
                        <li>
                            <Link href="/projects" className={button}>Реализованные проекты</Link>
                        </li>
                        <li>
                            <Link href="/info" className={button}>Информация</Link>
                        </li>
                        <li>
                            <Link href="/services" className={button}>Услуги</Link>
                        </li>
                        <li>
                            <Link href="/contact-us" className={button}>Контакты</Link>
                        </li>
                        <li>
                            <Link href="/partners" className={button}>Партнерам</Link>
                        </li>

                        {isAuthenticated ? (
                        <li>
                            <Link href="/account" className="w-15 h-10 flex items-center justify-center border-2 rounded-full border-PLGreen">
                                <i className="fas fa-user text-gray-600"></i>
                                {/* <FontAwesomeIcon icon={faCat} /> */}
                            </Link>
                        </li>
                        ) : (
                            <li>
                                <Link href="/account" className="w-10 h-10 flex items-center justify-center border-3 rounded-full border-PLGreen">
                                    {/* <i className="fas fa-user text-gray-600"></i> */}
                                    <FontAwesomeIcon className='text-base' icon={faUser}  />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </header>
    );
}             
           