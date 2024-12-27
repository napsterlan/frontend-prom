import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth } from '@/utils/auth';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image';

export default function Header() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [showCatalog, setShowCatalog] = useState(false);
    const [isProductLightboxOpen] = useState(false);
    const [isDrawingLightboxOpen] = useState(false);
    const [isDistributionLightboxOpen] = useState(false);

    useEffect(() => {
        setIsAuthenticated(auth.isAuthenticated());
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const navigationElement = document.getElementById('navigation');
            const fakeboxElement = document.getElementById('navigation-fakebox');

            if (!navigationElement) return;

            const navigationRect = navigationElement.getBoundingClientRect();
            // const scrollPosition = window.scrollY;

            // Если блок fakebox существует, проверяем его позицию
            if (fakeboxElement) {
                const fakeboxRect = fakeboxElement.getBoundingClientRect();
                // Если верхняя точка navigation достигла верхней точки fakebox
                if (navigationRect.top <= fakeboxRect.top) {
                    setIsSticky(false);
                }
            } else {
                // Если fakebox не существует, проверяем только верхнюю границу окна
                setIsSticky(navigationRect.top <= 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const navigation = document.getElementById('navigation');
        const isAnyLightboxOpen = isProductLightboxOpen || isDrawingLightboxOpen || isDistributionLightboxOpen;

        if (navigation && isSticky && isAnyLightboxOpen) {
            // Получаем ширину скроллбара
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            navigation.style.marginRight = `${scrollbarWidth}px`;
        } else if (navigation) {
            navigation.style.marginRight = '0';
        }

        // Очистка стилей при размонтировании
        return () => {
            if (navigation) {
                navigation.style.marginRight = '0';
            }
        };
    }, [isSticky, isProductLightboxOpen, isDrawingLightboxOpen, isDistributionLightboxOpen]);

    const handleLogout = () => {
        auth.logout();
        setIsAuthenticated(false);
        router.push('/login');
    };
    const button = "px-[5px]  py-[3px] font-normal border-2 border-transparent text-[14px] rounded-[10px] hover:border-PLGreen font-commissioner";
    const catalogButton = "bg-[#f0f0f0] px-[10px]  py-[2px] [&>*]:border-0 s border-2 border-[#f0f0f0] hover:border-PLGreen rounded-[10px] flex";

    const handleCatalogMouseEvents = (show: boolean) => (event: React.MouseEvent) => {
        const target = event.relatedTarget as HTMLElement;
        if (show) {
            setShowCatalog(true);
        } else if (!target?.closest('#catalog-menu')) {
            setShowCatalog(false);
        }
    };

    const handleMenuMouseEvents = (show: boolean) => (event: React.MouseEvent) => {
        const target = event.relatedTarget as HTMLElement;
        if (show) {
            setShowCatalog(true);
        } else if (!target?.closest('.catalog-trigger')) {
            setShowCatalog(false);
        }
    };

    return (
        <header className="relative w-full" style={{ height: '160px' }}>
            <div id='info-header' className="bg-[#1A1F2A] h-[80px] flex rounded-b-3xl ">
                <div className="flex-1 flex flex-col justify-center text-center text-white">
                    <div className="flex w-full justify-end">
                        <div className="flex flex-col text-left text-xs pl-8 h-full align-middle inline-block">
                            <div className="text-[12px] leading-[15px] text-white font-medium">Санкт-Петербург</div>
                            <div className="text-[12px] leading-[14px] text-white font-extralight"><a href="tel:+78129997420" className="text-[12px] leading-[14px] text-white font-extralight" itemProp="telephone">8-812-999-74-20</a></div>
                            <div className="text-[12px] leading-[16px] text-white font-extralight"><a href="mailto:info@promled.com">info@promled.com</a></div>
                        </div>
                        <div className="flex flex-col text-left text-xs pl-4 h-full align-middle inline-block">
                            <div className="text-[12px] leading-[15px] text-white font-medium">Москва</div>
                            <div className="text-[12px] leading-[14px] text-white font-extralight"><a href="tel:+74957447861" className="text-[12px] leading-[14px] text-white font-extralight" itemProp="telephone">8-495-744-78-61</a></div>
                            <div className="text-[12px] leading-[16px] text-white font-extralight"><a href="mailto:msk@promled.com">msk@promled.com</a></div>
                        </div>
                        <div className="flex flex-col text-left text-xs pl-4 h-full align-middle inline-block">
                            <div className="text-[12px] leading-[15px] text-white font-medium">Казахстан</div>
                            <div className="text-[12px] leading-[14px] text-white font-extralight"><a href="tel:+77273123437" className="text-[12px] leading-[14px] text-white font-extralight" itemProp="telephone">8-727-312-34-37</a></div>
                            <div className="text-[12px] leading-[16px] text-white font-extralight"><a href="mailto:kz@promled.com">kz@promled.com</a></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center px-[30px]">
                    <input
                        type="text"
                        placeholder="Поиск товара по каталогу"
                        className="w-full h-[37px] leading-[27px] pl-5 shadow-none rounded-l-[20px] bg-[#5e6269] text-white text-base font-commissioner font-extralight border-none outline-none focus:outline-none placeholder:text-[rgba(255,255,255,0.70)] placeholder:text-[15px] placeholder:font-manrope placeholder:font-small"
                    />
                    <button
                        type="button"
                        className="flex items-center h-[37px] text-[13px] leading-[40px] pr-3 align-top text-[#d5d5d5] rounded-r-[20px] bg-[#5e6269]"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                            <path d="M16.8271 18C16.5077 17.9051 16.2865 17.6877 16.0613 17.4623C14.7056 16.0983 13.3459 14.7343 11.9902 13.3743C11.9452 13.3268 11.9042 13.2754 11.8592 13.224C9.82776 14.5169 7.65709 14.8806 5.33898 14.2124C3.62292 13.7182 2.25908 12.7219 1.26795 11.2828C-0.874054 8.17127 -0.247427 4.08322 2.73417 1.68732C5.57243 -0.589975 9.58202 -0.542531 12.3547 1.71104C13.9316 2.99202 14.8408 4.64068 15.021 6.63331C15.2012 8.62199 14.5991 10.3853 13.2926 11.943C13.3786 12.03 13.4606 12.117 13.5466 12.2C14.9186 13.5759 16.2865 14.9517 17.6586 16.3237C18.0845 16.7507 18.1214 17.32 17.7159 17.6995C17.5766 17.83 17.3678 17.8972 17.1917 17.996C17.0688 18 16.95 18 16.8271 18ZM7.53012 1.90872C4.4748 1.90477 1.98058 4.31253 1.97239 7.26984C1.9642 10.2232 4.48709 12.6586 7.53832 12.6389C10.6141 12.6191 13.092 10.2272 13.0879 7.2738C13.0838 4.31648 10.5895 1.90872 7.53012 1.90872Z" fill="#d5d5d5"></path>
                        </svg>
                    </button>
                </div>
                <div className="flex-1 flex items-center text-white justify-start">
                    <div className="inline-block text-white flex-shrink-0 ml-[0px]">
                        <div className="mainphone"><a href="tel:+78005503922" className="leading-[27px] text-PLGreen text-[19px] font-extrabold font-Commissioner tracking-[0.475px]" itemProp="telephone">8 (800) 550-39-22</a> </div>
                        <div className="text-[14px] font-Commissioner font-normal [&>strong]:ml-[13px]">Звонки по РФ <strong>Бесплатно</strong></div>
                    </div>
                    <div className="flex text-white flex-shrink-0 pt-[8px]">
                        <a href="https://www.youtube.com/c/PromLED" target="_blank" className="p-[15px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="21" viewBox="0 0 30 21" fill="none">
                                <path d="M28.768 4.73068C28.768 4.73068 28.4852 2.72757 27.6134 1.84419C26.5073 0.687656 25.2694 0.681844 24.7017 0.612103C20.6355 0.31958 14.5293 0.31958 14.5293 0.31958C14.5293 0.31958 8.42312 0.31958 4.35685 0.614041C3.78924 0.681844 2.54941 0.687656 1.44518 1.84613C0.573421 2.72951 0.290586 4.73068 0.290586 4.73068C0.290586 4.73068 0 6.68729 0 9.0391V11.9469C0 14.2987 0.290586 16.3444 0.290586 16.3444C0.290586 16.3444 0.573421 18.3456 1.44518 19.229C2.55134 20.3874 4.00234 20.3506 4.64938 20.4727C6.97406 20.6955 14.5293 20.6683 14.5293 20.6683C14.5293 20.6683 20.6355 20.7555 24.7017 20.4611C25.2694 20.3933 26.5092 20.3874 27.6134 19.229C28.4832 18.3475 28.768 16.3444 28.768 16.3444C28.768 16.3444 29.0605 14.2987 29.0605 11.9488V9.0391C29.0605 6.68729 28.768 4.73068 28.768 4.73068ZM10.6548 14.3723V6.62336L18.4038 10.4978L10.6548 14.3723Z" fill="white"></path>
                            </svg>
                        </a>

                        <a href="https://t.me/promled" target="_blank" className="p-[15px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="21" viewBox="0 0 25 21" fill="none">
                                <path d="M24.3624 2.17331L20.698 19.4519C20.4213 20.6706 19.7004 20.9742 18.6758 20.4L13.0947 16.2853L10.4011 18.8776C10.1037 19.1751 9.85376 19.425 9.27953 19.425L9.68025 13.7406L20.0267 4.38967C20.477 3.98895 19.9297 3.76587 19.3286 4.16659L6.53644 12.2224L1.03167 10.4976C-0.166369 10.1237 -0.187024 9.29956 1.2816 8.72532L22.8173 0.427891C23.815 0.0540216 24.6867 0.650974 24.3624 2.17331Z" fill="white"></path>
                            </svg>
                        </a>
                        <a href="https://vk.com/promled_com" target="_blank" className="p-[15px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="19" viewBox="0 0 32 19" fill="none">
                                <path d="M31.2704 1.28752C31.4893 0.546112 31.2704 0 30.2138 0H26.7148C25.8229 0 25.414 0.468354 25.1933 0.990958C25.1933 0.990958 23.4112 5.33092 20.8928 8.14647C20.0786 8.96022 19.7041 9.22061 19.2591 9.22061C19.0401 9.22061 18.7 8.96022 18.7 8.217V1.28752C18.7 0.396022 18.4503 0 17.714 0H12.214C11.6549 0 11.322 0.415913 11.322 0.801085C11.322 1.64376 12.5813 1.84087 12.7115 4.21519V9.3689C12.7115 10.4973 12.5089 10.7052 12.0638 10.7052C10.8752 10.7052 7.98947 6.3472 6.27796 1.35986C5.93421 0.392405 5.59408 0 4.69852 0H1.19951C0.200823 0 0 0.468354 0 0.990958C0 1.91682 1.18865 6.51899 5.53076 12.5986C8.42368 16.7486 12.498 19 16.2051 19C18.4322 19 18.7054 18.5009 18.7054 17.6401C18.7054 13.6745 18.5028 13.3002 19.6209 13.3002C20.1383 13.3002 21.0285 13.5606 23.1072 15.5624C25.4827 17.9367 25.8753 19 27.2069 19H30.7059C31.7046 19 32.2094 18.5009 31.9181 17.5154C31.2523 15.443 26.7564 11.1808 26.5538 10.8951C26.0364 10.2297 26.1847 9.93309 26.5538 9.33996C26.5592 9.33454 30.8308 3.3255 31.2704 1.28752Z" fill="white"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            {isSticky && <div id="navigation-fakebox" style={{ height: '80px' }} />}
            <div
                id="navigation"
                className={`${isSticky ? 'fixed top-0 left-0 right-0 z-50' : ''}`}
            >
                <div className="bg-[rgba(255,255,255)] h-[80px] flex justify-center">
                    <div className="justify-end flex items-center pr-8">
                        <Image src="/promled.svg" alt="Логотип" width={120} height={40} className="transition-all duration-300 h-[40px]" />
                    </div>
                    <div className="justify-start flex items-center">
                        <ul className="flex justify-start space-x-4 text-black items-center font-commissioner">
                            <li 
                                className={`${catalogButton} catalog-trigger`}
                                onMouseEnter={handleCatalogMouseEvents(true)}
                                onMouseLeave={handleCatalogMouseEvents(false)}
                            >
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

                                <Link style={{ paddingLeft: '10px' }} href="/catalog" className={button}>Каталог</Link>


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
                                <li className="relative group">
                                    <Link href="/account" className="relative flex items-center">
                                        <div className='z-10 w-10 h-10 flex items-center justify-center border-3 rounded-full border-PLGreen bg-white'>
                                            <FontAwesomeIcon className='text-base z-10' icon={faUser} width={14} height={16} />
                                        </div>
                                    </Link>
                                    <div className="absolute right-0 hidden group-hover:block mt-2">
                                        <button
                                            onClick={handleLogout}
                                            className="bg-white border border-gray-200 rounded-md py-2 px-4 text-sm text-gray-700 hover:bg-gray-50 shadow-md"
                                        >
                                            Выйти
                                        </button>
                                    </div>
                                </li>
                            ) : (
                                <li className='relative'>
                                    <Link href="/login" className=" relative flex items-center">
                                        <div className=' z-10 w-10 h-10 flex items-center justify-center border-3 rounded-full border-PLGreen bg-white'>
                                            <FontAwesomeIcon className='text-base z-10' icon={faUser} width={14} height={16} />
                                        </div>
                                        <div className='flex items-center justify-end tracking-[1px] text-[13px] inline-block h-[33px] w-[65px] bg-PLGreen text-white border border-PLGreen rounded-r-[10px] text-right pr-[10px]  font-semibold left-[-8px] relative'>Войти</div>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
                {isSticky?<div className='shadow-md w-full h-[0px] relative h-[6px] bottom-[6px]'/>:''}
                {showCatalog && (
                <div className=" w-full h-[525px] relative z-50 bottom-[35px] flex justify-center">
                    <div id="catalog-menu" className=' flex items-end h-full w-max'  onMouseEnter={handleMenuMouseEvents(true)} onMouseLeave={handleMenuMouseEvents(false)}>
                        <div id="catalog-menu"  className=" shadow-lg w-[800px] h-[500px] bg-white border-t-3 border-PLGreen rounded-[5px]">
                            
                        </div>
                    </div>
                </div>
                )}
            </div>

        </header>
    );
}
