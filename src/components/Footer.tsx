import { useState } from 'react';
import InvisibleCaptcha from './YandexCaptcha'
export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [IsCaptchaVisible, setIsCaptchaVisible] = useState<boolean>(false);
  const [captchaDisclaimer, setCaptchaDisclaimer] = useState<boolean>(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCaptchaVisible(true); // Show captcha on form submit
    };

    const handleCaptchaHidden = () => {
        setIsCaptchaVisible(false);
    };

    const handleCaptchaSuccess = (success: boolean, message: string) => {
        setStatus(success ? 'success' : 'error');
        setMessage(message);
        if(success) {
            console.log(message)

            console.log(email)
        }
        if (success) {
            setEmail('');
            setMessage('');
        }
        setIsCaptchaVisible(false);
        setStatus('idle');
    };

  return (
    <footer className="text-white mt-8 text-[10px] font-manrope" style={{  bottom: 0, width:"100%" }}>
        <div className=' bg-footerbg bg-cover bg-[center_top] bg-no-repeat rounded-t-[30px] bg-100 '>
            <div className="h-[13.5vh] flex items-center justify-center w-full">
                <form
                    onSubmit={handleSubscribe}
                    onFocus={() => setCaptchaDisclaimer(true)}
                    onScroll={() => setCaptchaDisclaimer(false)}
                    onBlur={() => setCaptchaDisclaimer(false)}
                    className="
                    max-w-[1000px]
                    w-full
                    h-[7.3vh]
                    flex
                    items-center
                    justify-center
                    flex-row
                    py-[1.2vh]
                    px-[1.6vh]
                    backdrop-blur-[2px]
                    bg-[#afafaf85]
                    rounded-[25px]
                    mx-[20px]
          ">
                    <div className='w-0'>
                        {/*<InvisibleCaptcha*/}
                        {/*    visible={IsCaptchaVisible}*/}
                        {/*    onChallengeHidden={handleCaptchaHidden}*/}
                        {/*    onSuccess={handleCaptchaSuccess}*/}
                        {/*/>*/}
                    </div>
                    <div className='flex flex-row w-[50%] pl-[1.5vh] h-full items-center text-[1.7em] font-medium'>
                        Подписка на примеры освещения, кейсы, новости
                    </div>
                    <div
                        className='flex flex-row w-[50%] h-full items-center justify-center bg-white p-[0.22vh] rounded-[15px] relative'>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.ru"
                            className=" w-full h-full pl-[3.5vh] pt-[0.2vh] rounded text-black flex-1 bg-transparent outline-none rounded-[12px] placeholder:text-[1.8vh] placeholder:font-[100] placeholder:text-[#7D7D7D] placeholder:leading-[4.2vh] text-[1.8vh] font-[100] leading-[4.2vh]"
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="font-semibold h-[4.2vh] w-[13vh] bg-PLGreen text-[1.4vh] text-center hover:bg-[#4cb587] text-white font-bold py-[0.22vh] px-[0.44vh] rounded transition-colors duration-200 flex-none rounded-[12px] mr-[4px] absolute right-0"
                        >
                            {status === 'loading' ? 'Подписка...' : 'Подписаться'}
                        </button>
                    </div>
                </form>
            </div>

            <div className=' w-full h-[340px] bg-[#1a1f2a]  rounded-t-[30px] flex flex-row justify-center items-center'>
                <div className="bg-[#1a1f2a] w-[895px] h-[254px] px-[5px]">
                    <div className="w-full h-24">
                        <div className="flex flex-row flex-nowrap items-center h-[50px]">
                            <div className="w-[135px] flex">
                                <a href="https://vk.com/promled_com" target="_blank">
                                    <svg viewBox="0 0 25 20"
                                         x="0px" y="0px"
                                         className="w-6 ml-[11px]">
                                        <path className="st0" d="M24.2,3.8c0.2-0.6,0-1-0.8-1h-2.7c-0.7,0-1,0.4-1.2,0.8c0,0-1.4,3.3-3.3,5.5c-0.6,0.6-0.9,0.8-1.2,0.8
                                            c-0.2,0-0.4-0.2-0.4-0.8V3.8c0-0.7-0.2-1-0.8-1H9.6c-0.4,0-0.7,0.3-0.7,0.6C8.9,4,9.9,4.2,10,6V10c0,0.9-0.2,1-0.5,1
                                            c-0.9,0-3.1-3.3-4.4-7.1c-0.3-0.7-0.5-1-1.2-1H1.2c-0.8,0-0.9,0.4-0.9,0.8c0,0.7,0.9,4.2,4.2,8.9c2.2,3.2,5.3,4.9,8.2,4.9
                                            c1.7,0,1.9-0.4,1.9-1c0-3-0.2-3.3,0.7-3.3c0.4,0,1.1,0.2,2.7,1.7c1.8,1.8,2.1,2.6,3.1,2.6h2.7c0.8,0,1.1-0.4,0.9-1.1
                                            c-0.5-1.6-3.9-4.8-4.1-5.1c-0.4-0.5-0.3-0.7,0-1.2C20.6,9.9,23.8,5.3,24.2,3.8z"
                                              fill="white">
                                        </path>
								    </svg>
                                </a>

                                <a href="https://t.me/promled" target="_blank">
                                    <svg viewBox="0 0 25 20"
                                         className="w-[25px] ml-[19px]">
										<path className="st0" d="M23.5,2.4l-3.4,15.8c-0.3,1.1-0.9,1.4-1.8,0.9l-5.1-3.8l-2.5,2.4c-0.3,0.3-0.5,0.5-1,0.5l0.4-5.2l9.5-8.6
										c0.4-0.4-0.1-0.6-0.6-0.2L7.2,11.6l-5-1.6C1.1,9.7,1.1,9,2.4,8.4l19.7-7.6C23,0.5,23.8,1,23.5,2.4z"
                                              fill="white"/>
									</svg>
                                </a>

                                <a href="https://www.youtube.com/c/PromLED" target="_blank">
                                    <svg viewBox="0 0 25 20"
                                         className="w-[26px] ml-[19px]">
										<path className="st0" d="M23.4,5.4c0,0-0.2-1.5-0.9-2.2c-0.8-0.9-1.8-0.9-2.2-0.9C17.2,2,12.5,2,12.5,2S7.8,2,4.7,2.3
										C4.3,2.3,3.3,2.3,2.5,3.2C1.8,3.9,1.6,5.4,1.6,5.4S1.4,6.9,1.4,8.7v2.2c0,1.8,0.2,3.4,0.2,3.4s0.2,1.5,0.9,2.2c0.8,0.9,2,0.9,2.4,1
										c1.8,0.2,7.6,0.1,7.6,0.1s4.7,0.1,7.8-0.2c0.4-0.1,1.4-0.1,2.2-0.9c0.7-0.7,0.9-2.2,0.9-2.2s0.2-1.6,0.2-3.4V8.7
										C23.6,6.9,23.4,5.4,23.4,5.4z M9.5,12.8V6.8l5.9,3L9.5,12.8z" fill="white"/>
									</svg>
                                </a>

                            </div>

                            <div className="ml-11 h-[40px]">
                                <div className="text-PLGreen font-commissioner text-[25px] not-italic font-extrabold tracking-[-0.2px] leading-[10px]">
                                    <a href="tel:+78005503922" className='text-PLGreen'>8 (800) 550-39-22</a>
                                </div>
                                <div className="text-white font-commissioner text-[14px] font-normal font-normal leading-[43px]">
                                    Звонки по РФ <b className='ml-[56px]'>Бесплатно</b>
                                </div>
                            </div>
                            <div className="infobox-hr">
                                <hr className='mb-[26px] border-2 rounded-[3px] text-white ml-[22px] w-[208px]' />
                            </div>
                            <div className="text-white font-commissioner text-[12px] ml-[20px] leading-[-0.3px]">
                                <div className='relative -top-1.5 flex items-center'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" viewBox="0 0 13 16"
                                         fill="none">
                                        <path
                                            d="M6.5 0C4.77609 0 3.12279 0.689609 1.90381 1.91712C0.684819 3.14463 0 4.80949 0 6.54545C0 12.3636 6.5 16 6.5 16C6.5 16 13 12.3636 13 6.54545C13 4.80949 12.3152 3.14463 11.0962 1.91712C9.87721 0.689609 8.22391 0 6.5 0ZM6.5 9.45455C5.92863 9.45455 5.37009 9.28393 4.89502 8.96428C4.41994 8.64462 4.04967 8.19028 3.83101 7.65872C3.61236 7.12715 3.55515 6.54223 3.66662 5.97792C3.77809 5.41361 4.05323 4.89526 4.45725 4.48842C4.86127 4.08157 5.37602 3.80451 5.93641 3.69226C6.4968 3.58001 7.07765 3.63762 7.60553 3.85781C8.13341 4.07799 8.58459 4.45085 8.90202 4.92925C9.21946 5.40765 9.38889 5.97009 9.38889 6.54545C9.38889 7.31699 9.08453 8.05693 8.54275 8.60249C8.00098 9.14805 7.26618 9.45455 6.5 9.45455Z"
                                            fill="white"/>
                                    </svg>
                                    <a target="_blank" href="https://yandex.ru/maps/-/C2tRivc" className='ml-2.5 text-white'>
                                        Санкт-Петербург, ш. Революции, 102В
                                    </a>
                                </div>
                                <div className='flex items-center'>
                                    <svg viewBox="0 0 15 12" fill="none" width="15" height="12">
                                        <path
                                            d="M7.5 9C7.01572 9 6.53145 8.83056 6.11836 8.48719L0 3.4125V10.5C0 11.3281 0.62959 12 1.40625 12H13.5938C14.3704 12 15 11.3284 15 10.5V3.4125L8.88281 8.49063C8.46973 8.83125 7.9834 9 7.5 9ZM0.477246 2.54063L6.69404 7.7C7.16836 8.09375 7.83281 8.09375 8.30713 7.7L14.5239 2.54063C14.7979 2.29063 15 1.90625 15 1.5C15 0.671562 14.3701 0 13.5938 0H1.40625C0.62959 0 0 0.671562 0 1.5C0 1.90625 0.176074 2.29063 0.477246 2.54063Z"
                                            fill="white"/>
                                    </svg>
                                    <a href="mailto:info@promled.com" className='ml-2.5'>info@promled.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full pl-[10px] flex items-center flex-nowrap flex-row">
                        <svg width="118" height="97" viewBox="0 0 103 77" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.4055 0H0V20.9014H20.4055V0Z" fill="white"></path>
                            <path d="M20.4054 27.8662H-6.10352e-05V48.7677H20.4054V27.8662Z" fill="white"></path>
                            <path d="M47.6106 0H27.2051V20.9014H47.6106V0Z" fill="white"></path>
                            <path d="M47.6106 27.8662H27.2051V48.7677H47.6106V27.8662Z" fill="white"></path>
                            <path d="M20.4054 55.7327H-6.10352e-05V76.6341H20.4054V55.7327Z" fill="white"></path>
                            <path d="M74.8157 0H54.4102V20.9014H74.8157V0Z" fill="white"></path>
                            <path d="M74.8156 27.8662H54.4101V48.7677H74.8156V27.8662Z" fill="white"></path>
                            <path d="M74.8156 55.7327H54.4101V76.6341H74.8156V55.7327Z" fill="white"></path>
                            <path d="M102.024 55.7327H81.6186V76.6341H102.024V55.7327Z" fill="white"></path>
                        </svg>

                        <div className="w-full px-[7px] flex items-start flex-nowrap flex-row">
                            <div className="ml-[60px] h-[137px]">
                                <div className='font-commissioner
                                text-white text-[25px]
                                leading-[42px]
                                tracking-[0.125px]
                                mb-[6px]
                                font-semibold
                                ml-0
                                '>ПРОДУКЦИЯ</div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/v-pomeschenii/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>
                                        В помещении
                                    </a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/naruzhnoe/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Наружное</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/kategorii/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Категории</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/poisk/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Расширенный поиск</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/kategorii/oborudovaniya-dlya-sistemy-upravleniya/"
                                       className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>
                                        Система управления освещением</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/aksessuary/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Аксессуары и опции</a>
                                </div>
                            </div>
                            <div className="ml-[58px] textbox">
                                <div className='font-commissioner
                                text-white text-[25px]
                                leading-[42px]
                                tracking-[0.125px]
                                mb-[6px]
                                font-semibold
                                ml-0'>О КОМПАНИИ</div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/svyazatsya-s-nami/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Контакты</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/realizovannye-proekty-osvescheniya/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Портфолио</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/cases/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Кейсы</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/o-kompanii/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>О компании</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/novosti/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Новости</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/rekvizity-i-oplata/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Реквизиты</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/work-with-us/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Вакансии</a>
                                </div>
                            </div>
                            <div className="ml-[84px] textbox">
                                <div className='font-commissioner
                                text-white text-[25px]
                                leading-[42px]
                                tracking-[0.125px]
                                mb-[6px]
                                font-semibold
                                ml-0'>РАЗДЕЛЫ</div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/ofitsialnye-dilery/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Официальные дилеры</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/garantiynye-obyazatelstva/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Гарантийные обязательства</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/zayavka-na-fotometricheskie-ispytaniya/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Фотометрические испытания</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/besplatnyy-proekt-osvescheniya/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Проект освещения</a>
                                </div>
                                <div className='text-[12px] leading-[15px] font-commissioner text-white/50'>
                                    <a href="/fayly-dlya-skachivaniya/" className='text-[12px] leading-[15px] tracking-[-0.3px] ml-1 leading-[15px]'>Документы для скачивания</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <span className={`fixed flex m-auto flex-row flex-nowrap w-full justify-center 
                    ${captchaDisclaimer ? 'bottom-[5px]' : '-bottom-[100px]'} 
                    transition-[bottom] duration-200 ease-in-out delay-[0.2s]`}>
                    <a target="_blank"
                       href="https://yandex.ru/legal/smartcaptcha_notice/"
                       className='backdrop-blur-[7px] p-[5px] text-[11px] cursor-pointer text-white rounded-[14px] bg-black/65 w-max'
                    >
                        Политика обработки персональных данных Smart captcha
                    </a>
                </span>
            </div>
        </div>

    </footer>
  );
} 