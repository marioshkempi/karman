import SearchInput from "../SeachInput"
interface PageTitleProps {
  title: string
  count?: number
  countlabel?: string
  isSearch?: boolean
}

export default function PageTitle({ title, count, countlabel, isSearch = false }: PageTitleProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div className="flex items-baseline gap-2">
        <h2 className="text-xl lg:text-[30px] font-semibold text-secondary">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-xl lg:text-[25px] font-semibold text-primary2">
            ({count})
          </span>
        )}
      </div>
      
      {/*{isSearch && <SearchInput />}*/}
    </div>
  )
}