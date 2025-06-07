export default function Button({
    children,
    type='button',
    onClick=()=>{},
    text='',
    className='',
    background='',
    disabled=false
}){
    return(
        <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={
            `${background?background:'bg-blue-500 hover:bg-blue-700'} text-white rounded-md py-2 px-4 transition-all ${className} 
            flex gap-x-1`
        }
        >
            {text}
            {children}
        </button>
    )
}