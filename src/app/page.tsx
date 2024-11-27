import CategoryList from '../components/CategoryList';
import Layout from './layout';

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Главная страница</h1>
      <CategoryList />
    </Layout>
  );
}
