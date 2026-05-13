interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
  className?: string
}

export const MenuButton = ({ 
  onClick, 
  isActive, 
  disabled, 
  children, 
  title,
  className = ''
}: MenuButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`px-2 py-1.5 text-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
      isActive ? 'bg-gray-200 text-secondary font-semibold' : ''
    } ${className}`}
  >
    {children}
  </button>
)

