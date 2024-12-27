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
    <footer className="bg-gray-800 text-white p-4 mt-8">
      <div className="container mx-auto">
        <div className="max-w-md mx-auto mb-8">
          <h3 className="text-xl font-semibold mb-4">Подпишитесь на нашу рассылку</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите ваш email"
              className="px-4 py-2 rounded text-black"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-PLGreen hover:bg-[#4cb587] text-white font-bold py-2 px-4 rounded transition-colors duration-200"
            >
              {status === 'loading' ? 'Подписка...' : 'Подписаться'}
            </button>
            {message && (
              <p className={`text-sm ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} ООО &quot;Пром-Свет&quot;. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
} 