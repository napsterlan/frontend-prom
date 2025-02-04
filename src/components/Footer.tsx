import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    setStatus('success');
    setMessage('Вы успешно подписались на рассылку!');
  };

  return (
    <footer className="text-white mt-8 text-[10px] font-manrope">
      <div className=' bg-footerbg bg-cover bg-top bg-no-repeat rounded-t-[30px] bg-100'>
        <div className="h-[13.5vh] flex items-center justify-center w-full" >
          <form onSubmit={handleSubscribe} className="
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
            <div className='flex flex-row w-[50%] pl-[1.5vh] h-full items-center text-[1.7em] font-medium'>
            Подписка на примеры освещения, кейсы, новости
            </div>
            <div className='flex flex-row w-[50%] h-full items-center justify-center bg-white p-[0.22vh] rounded-[15px] relative'>
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

        <div className=' w-full h-[37vh] bg-[#1a1f2a]  rounded-t-[30px]'>

        </div>
      </div>
    </footer>
  );
} 