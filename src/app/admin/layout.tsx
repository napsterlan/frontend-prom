import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Админ панель',
    description: 'Административная панель управления сайтом',
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession();

    if (!session?.user) {
        redirect('/auth/signin?callbackUrl=/admin');
    }

    return (
        <div className="flex flex-col items-center min-h-screen">
            <div className="py-8">
                {children}
            </div>
        </div>
    );
} 