import { useSession } from "next-auth/react"
import { ProtectedRoute } from "@/app/_components/auth/ProtectedRoute"
import Link from "next/link"
import { FiUser, FiLock, FiSettings, FiShield } from "react-icons/fi"
import {getAllProjects, getCurrentUser, searchFor} from "@/api";   
import { getAllProjectCategories } from "@/api";
// import {Project, ProjectCategory} from "@/types/types";
import {User} from "@/types/types"
import { authOptions } from "@/app/api/auth/[...nextauth]/auth.config";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";
// export async function getServerSideProps() {
//     try {
//         const response = await getCurrentUser();

//         return {
//             props: {
//                 user: response.data as User,
//             },
//         }

//     } catch (error) {
//         return {
//             props: {
//                 user: {} as User,
//             },
//         };
//     }
// }


export default async function AccountPage() {
    const session = await getServerSession(authOptions)
    console.log("SESSION:", session)
    console.log("Session Token:", session?.jwt); // Add this
    if (!session) {
        redirect('/login')
    }


        console.log("Making API call with session token:", session.jwt);
        const response = await getCurrentUser(session.jwt);
        const user = response.data as User;
        let userRole = "";
        if (user.Role === "admin") {
            userRole = "Администратор";
        } else if (user.Role === "manager") {
            userRole = "Менеджер";
        } else if (user.Role === "client") {
            userRole = "Дилер"
        }
        console.log("Profile API Response:", user);
        if (!user) {
            return <div>Loading...</div>
        }

        return (

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <div className="w-64 shrink-0">
                        <div className="bg-white rounded-xl shadow-md p-6 border-t-1 border-[#b7b7b72b]">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-2">{user?.FirstName || session?.user?.name || 'User'} {user?.LastName || ''}</h2>
                                <p className="text-gray-600">{user.Email}</p>
                            </div>
                            <nav className="space-y-2">
                                <Link
                                    href="/profile"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiUser className="w-5 h-5"/>
                                    <span>Профиль</span>
                                </Link>
                                <Link
                                    href="/src/pages/profile/password"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiLock className="w-5 h-5"/>
                                    <span>Изменить пароль</span>
                                </Link>
                                <Link
                                    href="/src/pages/profile/settings"
                                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                >
                                    <FiSettings className="w-5 h-5"/>
                                    <span>Настройки</span>
                                </Link>
                                {session?.user?.role === "admin" ? (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700"
                                    >
                                        <FiShield className="w-5 h-5"/>
                                        <span>Админка</span>
                                    </Link>
                                ) : ""}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}

                    <div className="flex-1">
                        <div className="bg-white rounded-xl p-6 shadow-md border-t-1 border-[#b7b7b72b]">
                            <h1 className="text-2xl font-bold mb-6">Информация о пользователе</h1>

                            <div className="flex items-center mb-6 h-[100px]">

                                <div className="relative w-24 h-24 rounded-full overflow-hidden mr-6">
                                    {user?.ImageURL ?
                                        <Image
                                            src={user?.ImageURL || ''}
                                            alt="Profile"
                                            fill
                                            className="object-cover"
                                        /> :
                                        <FiUser className="w-24 h-24"/>
                                    }

                                </div>
                                <div className="flex flex-col justify-between h-full  ml-8">
                                    <div className="text-[24px] font-medium">{user?.LastName || ''} {user?.FirstName || session?.user?.name || 'User'} </div>
                                    <div className="w-full flex">
                                        <div className="flex flex-col mr-8">
                                            <div className="text-[14px] text-[#757575] font-medium">Роль</div>
                                            <div>{userRole || ''}</div>
                                        </div>
                                        <div className="flex flex-col mr-8">
                                            <div className="text-[14px] text-[#757575] font-medium">Телефон</div>
                                            <div>{user.Phone || ''}</div>
                                        </div>
                                        <div className="flex flex-col mr-8">
                                            <div className="text-[14px] text-[#757575] font-medium">Почта</div>
                                            <div>{user.Email || ''}</div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/* Content will change based on the active route */}
                            <div className="space-y-4">
                                <div className="w-full max-w-[350px] bg-white border rounded-xl border-gray-200 shadow-sm ">
                                    <div className='flex flex-col h-[110px] font-Manrope px-[10px] justify-between text-left pb-[10px]'>
                                        <div >
                                            <h4 className="text-[19.6px] font-semibold mb-[14px] tracking-[-.05em] leading-6"></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
}