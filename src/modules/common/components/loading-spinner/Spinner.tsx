// components/Spinner.tsx
"use client"

const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-0">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
    </div>
  )
}

export default Spinner
