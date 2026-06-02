interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => void;
  submitLabel?: string;
  submitDisabled?: boolean;
  overlayClassName?: string;
  containerClassName?: string;
}

export const Modal: React.FC<ModalProps> = ({
  title,
  children,
  onClose,
  onSubmit,
  submitLabel,
  submitDisabled,
  overlayClassName,
  containerClassName,
}) => {
  return (
    <>
      <div
        className={overlayClassName ?? 'fixed inset-0 z-40 bg-white/2 backdrop-blur-sm'}
        onClick={onClose}
      />
      <div className={containerClassName ?? 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl z-50 w-full max-w-md p-6'}>
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
              disabled={submitDisabled}
              className={`flex-1 px-4 py-2 rounded-lg transition font-semibold ${submitDisabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {submitLabel || 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
