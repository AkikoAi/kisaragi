"use server"

import Navigation from "@/Components/Navigation";
import DataAccessLayer from "@/utils/DataAccessLayer";

const MenuOrigin = [
    {
        name: "Hanya dapat dilihat User keatas",
        path: null,
        prefetch: false,
        minPrifilege: 11
    },
    {
        name: "Hanya dapat dilihat Moderator keatas",
        path: null,
        prefetch: false,
        minPrifilege: 31
    },
    {
        name: "Hanya dapat dilihat Manager keatas",
        path: null,
        prefetch: false,
        minPrifilege: 61
    },
    {
        name: "Hanya dapat dilihat superadmin keatas",
        path: null,
        prefetch: false,
        minPrifilege: 91
    },
    {
        name: "Management User",
        path: "/management-users",
        prefetch: true,
        minPrifilege: 91
    },
    {
        name: "Dashboard",
        path: "/dashboard",
        prefetch: true,
        minPrifilege: 1
    },
    {
        name: "Logout",
        path: "/api/logout",
        prefetch: false,
        minPrifilege: 1
    },
    {
        name: "Database Studio",
        path: "/database-studio",
        prefetch: true,
        minPrifilege: 91
    }
]

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const data = await DataAccessLayer();
    const menu = MenuOrigin
        .filter(({ minPrifilege }) => data.privilege >= minPrifilege)
        .map(({ minPrifilege, ...filteredMenu }) => filteredMenu || minPrifilege);

    return (<>
        <div className="min-h-screen w-full flex flex-col bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 break-words">
            {/* Navigation */}
            <Navigation data={data} menu={menu} />

            {/* Content */}
            <main className="flex-1 relative container mx-auto px-8 py-10 mt-16">
                {children}
            </main>
        </div>

    </>);
}