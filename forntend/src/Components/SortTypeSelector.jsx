import { RxCaretSort } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { cn } from "@/lib/utils"
import { ShadCnButton, buttonVariants } from "./ShadCnButton";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
  } from "@/Components/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/Components/popover"
export default function SortTypeSelector({
    sortTypes=[],
    isOpened,
    setIsOpened,
    value,
    setValue
}){
    console.log(sortTypes)
    return (
        <Popover open={isOpened} onOpenChange={setIsOpened} className='w-full'>
          <PopoverTrigger asChild>
            <ShadCnButton
              variant="outline"
              role="combobox"
              aria-expanded={isOpened}
              className="w-[200px] justify-between"
            >
              {value
                ? sortTypes.find((sortType) => sortType.value === value)?.label
                : "Sort By..."}
              <RxCaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </ShadCnButton>
          </PopoverTrigger>
          <PopoverContent className="max-w-[200px] p-0 opac">
            <div className="w-full flex flex-col gap-y-1">{
              sortTypes.map(sortType=>(
                <button
                key={sortType.value}
                className="w-full flex items-center justify-between p-2 hover:bg-gray-100"
                onClick={()=>{
                  setValue(value===sortType.value?'':sortType.value)
                  setIsOpened(false)
                }}
                >
                  {sortType.label}
                  {
                    <FaCheck
                    className={`${sortType.value===value?'opacity-50':'opacity-0'}`}
                    />
                  }
                </button>
              ))
            }
            </div>
          </PopoverContent>
        </Popover>
      )
}