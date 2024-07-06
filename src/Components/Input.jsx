import { useId } from "react"
import { forwardRef } from "react"
const Input=forwardRef(function({
    label,
    className,
    type='text',
    placeholder='',
    ...otherProps
},ref){
    const id=useId()
    return(
        <div className="flex flex-col gap-y-1">
            <label htmlFor={id}>{label}</label>
            <input 
            type={type}
            className={`${className} bg-none outline-none border-2 border-black rounded-md text-gray-800 py-2 px-1`}
            placeholder={placeholder}
            ref={ref}
            {...otherProps}
            />
        </div>
    )
})

export default Input