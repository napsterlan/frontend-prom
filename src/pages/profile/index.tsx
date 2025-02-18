import { useSession } from "next-auth/react"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import Link from "next/link"
import { FiUser, FiLock, FiSettings, FiShield } from "react-icons/fi"
import {getAllProjectCategories, getAllProjects, getCurrentUser, searchFor} from "@/api/apiClient";
// import {Project, ProjectCategory} from "@/types/types";
import {User} from "@/types/types"


export async function getServerSideProps() {
    try {
        const response = await getCurrentUser();

        return {
            props: {
                user: response.data as User,
            },
        }

    } catch (error) {
        return {
            props: {
                user: {} as User,
            },
        };
    }
}


const AccountPage = (user: User ) => {
    const { data: session } = useSession()

    if (!session?.user) {
        return null
    }



    return (
        <ProtectedRoute>
            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 border-t-1 border-[#b7b7b72b]">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">{user.FirstName} {user.LastName}</h2>
                                <p className="text-gray-600">{user.Email}</p>
                            </div>
                            <nav className="space-y-2">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiUser className="w-5 h-5" />
                                    <span>Профиль</span>
                                </Link>
                                <Link
                                    href="/src/pages/profile/password"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiLock className="w-5 h-5" />
                                    <span>Изменить пароль</span>
                                </Link>
                                <Link
                                    href="/src/pages/profile/settings"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiSettings className="w-5 h-5" />
                                    <span>Настройки</span>
                                </Link>
                                {session?.user?.role === "admin" ? (
                                    <Link
                                        href="/admin/dashboard"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                    >
                                        <FiShield className="w-5 h-5" />
                                        <span>Админка</span>
                                    </Link>
                                ): ""}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-md border-t-1 border-[#b7b7b72b]">
                            <h1 className="text-2xl font-bold mb-6">Профиль</h1>
                            {/* Content will change based on the active route */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Имя</label>
                                    <div className="mt-1 text-gray-900">{session.user.name}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <div className="mt-1 text-gray-900">{session.user.email}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}

export default AccountPage