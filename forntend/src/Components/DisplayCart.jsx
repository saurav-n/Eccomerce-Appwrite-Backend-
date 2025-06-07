export default function DisplayCart({item}){
    return(
            <div className="rounded-md overflow-hidden relative group border-2 bg-white p-1
            hover:scale-105 transition-all">
                <div className="w-full h-[200px] relative">
                    <img src={`${item.featuredImgs[0]}`} alt={item.name} 
                    className="w-full h-full object-contain" 
                    />
                    <div className="bg-slate-100 rounded-3xl py-1 px-2 text-black text-sm 
                    absolute top-0 right-0">{item.category.toUpperCase()}</div>
                </div>
                <div className="w-full flex justify-between text-xs gap-x-1">
                    <h1 className="text-slate-400">{item.name.toUpperCase()}</h1>
                    <h1 className="text-slate-600">{`Rs ${item.price}`}</h1>
                </div>
            </div>
    )
}