import { useQuery } from 'react-query';
import axios from 'axios';

const fetchCategories = async () => {
  const { data } = await axios.get('/api/categories');
  return data;
};

export default function CategoryList() {
  const { data, error, isLoading } = useQuery('categories', fetchCategories);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка загрузки данных</div>;

  return (
    <ul>
      {data.data.map((category: any) => (
        <li key={category.CategoryID}>{category.Name}</li>
      ))}
    </ul>
  );
} 