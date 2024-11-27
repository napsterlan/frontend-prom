import { useRouter } from 'next/router';

export default function CategoryPage() {
  const router = useRouter();
  const { slugs } = router.query;

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Категория: {Array.isArray(slugs) ? slugs.join(' / ') : slugs}
      </h1>
      {/* Здесь можно добавить компонент для отображения продуктов или подкатегорий */}
    </div>
  );
} 