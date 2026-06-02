interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onSubmit,
}) => {
  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <form onSubmit={onSubmit}>
          <div className="mb-6">{children}</div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
