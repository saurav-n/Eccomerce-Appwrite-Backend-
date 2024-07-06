export default function ItemPropertyBadge({children:badgeIcon,badgeDesc,className}){
    return(
        <div className={`${className} flex flex-col justify-center items-center gap-y-1`}>
            <div className="rounded-full bg-gray-200 p-1">{badgeIcon}</div>
            <p className="text-[8px] text-gray-500">{badgeDesc}</p>
        </div>
    )
}