export default function ErrorPopup({
    title,
    message,
    onClose,
}: {
    title: string;
    message: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-xl max-w-sm w-full text-center">
                <h2 className="text-xl font-semibold mb-4 text-red-600">{title}</h2>
                <p className="mb-6">{message}</p>
                <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </div>
        </div>
    );
}