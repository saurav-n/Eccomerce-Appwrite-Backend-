import { useState,useEffect } from "react"

export default function SlidingNavigtion({children,shouldNavsBeShown}){
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
        <div className={`w-screen h-screen absolute top-0 bg-[rgb(0,0,0,0.7)] ${disableScreenCls} transition-all`}></div>
        <div 
        className={`w-[30%] min-w-[150px] h-screen fixed top-0 right-0 bg-white flex justify-center py-28 duration-200 ${slidingWindowCls}  shadow-lg`}
        >
            {children}
        </div>
        </>
    )
}