import { Link } from "react-router-dom";
import { storageService } from "../appwriteServices/storage";

export default function HorizontalDisplayCart({item}){
    return(
        <Link to={`/item/${item.$id}`}>
            <div className="w-full rounded-md overflow-hidden relative group border-2 bg-white p-2
            hover:border-gray-400 transition-all">
                <div className="w-full h-[200px] flex gap-x-2 items-center">
                    <img src={`${storageService.getFilePreview(item.featuredImgs[0])}`} alt={item.name} 
                    className="w-full h-full object-contain" 
                    />
                    <div className="flex flex-col gap-y-1">
                        <h3 className="font-bold">Description</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                    </div>
                </div>
                <div className="w-full flex justify-between text-xs gap-x-1">
                    <h1 className="text-slate-400">{item.name.toUpperCase()}</h1>
                    <h1 className="text-slate-600">{item.price}</h1>
                </div>
            </div>
        </Link>
    )
}