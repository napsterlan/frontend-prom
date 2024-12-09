
import { useState } from 'react';
import { Breadcrumbs }  from '@/components/Breadcrumbs';
import { useEffect } from 'react';

export default function FeedbackForm() {

useEffect(() => {
        const breadcrumbs = [
          {
            label: 'тест',
            href: '/test'
          }
        ];
        
        sessionStorage.setItem('breadcrumbs', JSON.stringify(breadcrumbs));
      }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Здесь будет логика отправки данных
    console.log('Отправка данных:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  return (
    <div className="max-w-lg mx-auto p-6">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6">Форма обратной связи</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Ваше имя
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Сообщение
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Отправить
        </button>
      </form>
    </div>
  );
}
