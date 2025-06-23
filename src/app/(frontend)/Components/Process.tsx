export default function Process({ status, message }: { status: boolean; message?: string }) {
    return (<>
        {status && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-4 py-2 rounded shadow border-1 border-cyan-800">
                {message || "Sedang diproses..."}
            </div>
        )}
    </>)
}