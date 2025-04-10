export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-4">Страница не найдена</h2>
      <p className="text-gray-600">
        Запрашиваемая страница не существует или была удалена
      </p>
    </div>
  );
} 