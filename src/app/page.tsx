import CategoryList from '../components/CategoryList';
import '../app/globals.css';
import Layout from './layout';

export default function HomePage() {
  return (
    <Layout>
      <h1 className="text-4xl font-bold">Главная страница</h1>
      <CategoryList />
    </Layout>
  );
}
