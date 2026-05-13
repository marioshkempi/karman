interface ToggleProps {
  wantInvoice: boolean;
  setWantInvoice: (val: boolean) => void;
}

const InvoiceToggle = ({ wantInvoice, setWantInvoice }: ToggleProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-3">
      <p className="text-sm font-bold text-gray-700 mb-3">Τύπος Παραστατικού</p>
      <div className="flex gap-6">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            checked={!wantInvoice}
            onChange={() => setWantInvoice(false)}
          />
          <span className="text-sm text-gray-600">Απόδειξη</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
            checked={wantInvoice}
            onChange={() => setWantInvoice(true)}
          />
          <span className="text-sm text-gray-600">Τιμολόγιο</span>
        </label>
      </div>
    </div>
  )
}

export default InvoiceToggle