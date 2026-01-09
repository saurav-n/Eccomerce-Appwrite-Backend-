import { useState,useEffect } from "react"
import { cn } from "@/lib/utils";

export default function SlidingNavigtion({children,shouldNavsBeShown, className=''}){
    const [slidingWindowCls, setSlidingWindowCls] = useState('translate-x-[100%]');
    const [disableScreenCls, setDisableScreenCls] = useState('hidden');
    useEffect(()=>{
        if(shouldNavsBeShown) {
            setDisableScreenCls('block')
            setSlidingWindowCls('translate-x-0')
        }
        else {
            setSlidingWindowCls('translate-x-[100%]')
            setDisableScreenCls('hidden')
        }
    },[shouldNavsBeShown])
    return(
        <>
        <div className={`fixed inset-0 w-screen h-screen bg-black bg-opacity-70 z-40 ${disableScreenCls} transition-all`}></div>
        <div 
        className={cn(`min-w-64 h-screen fixed top-0 right-0  flex justify-center duration-200 ${slidingWindowCls} shadow-lg z-50`,shouldNavsBeShown?'translate-x-0':'translate-x-[100%]',className)}
        >
            {children}
        </div>
        </>
    )
}