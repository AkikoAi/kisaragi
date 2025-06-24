
export default function Layout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 text-center">
            {children}
        </div>
    )
}