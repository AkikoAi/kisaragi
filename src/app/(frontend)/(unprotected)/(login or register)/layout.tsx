

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (<>
        <div className="min-h-screen bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100 flex flex-col">

            {children}
        </div>
    </>)
}