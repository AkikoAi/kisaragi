"use server"

import DataAccessLayer from "../../../utils/DataAccessLayer";
import Navigation from "../Components/Navigation";
import zillaGao from "../Components/zillaGao";


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const data = await DataAccessLayer();
    return (<>
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 flex flex-col break-words w-full ">
            <Navigation data={data} />
            <main className="flex-1 container mx-auto px-4 py-6">
                {children}
            </main>
        </div>
        <audio src={zillaGao} id="ZillaGao"></audio>
    </>);
}