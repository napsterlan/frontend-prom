export default function ContactUsPage() {
    return (
      <div>
        <h1 className="text-2xl font-bold">Свяжитесь с нами</h1>
        {/* Здесь можно добавить компонент для отображения формы связи */}
        <p className="mt-4 text-gray-600">
          Мы будем рады получить ваше сообщение и ответить на все ваши вопросы! 
          В нашем бизнесе мы ценим каждого клиента и стремимся обеспечить наилучший сервис. 
          Ваши отзывы и предложения очень важны для нас, так как они помогают нам улучшать наши услуги и делать их более удобными для вас. 
          Мы понимаем, что общение с клиентами — это ключ к успешному бизнесу, и мы готовы выслушать вас в любое время. 
          Если у вас есть какие-либо вопросы о наших продуктах или услугах, не стесняйтесь обращаться к нам. 
          Наша команда профессионалов всегда готова помочь вам и предоставить необходимую информацию. 
          Мы уверены, что ваше мнение поможет нам стать лучше и предложить вам еще более качественные решения. 
          Пожалуйста, заполните форму ниже, и мы свяжемся с вами в кратчайшие сроки. 
          Мы ценим ваше время и сделаем все возможное, чтобы ответить на ваше сообщение как можно быстрее. 
          Ваше удовлетворение — наш приоритет, и мы надеемся, что наше сотрудничество будет долгим и плодотворным. 
          Спасибо, что выбрали нас, и мы с нетерпением ждем вашего сообщения!
        </p>
        <form className="max-w-lg mt-8 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Ваше имя
            </label>
            <input
              type="text"
              id="name"
              name="name"
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
              rows={5}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
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