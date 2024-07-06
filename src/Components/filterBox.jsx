import { useState } from "react"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/Components/accordion"
import SortTypeSelector from "./SortTypeSelector"
import Button from "./Button";

export default function FilterBox({
    category,
    setCategory,
    sortTypes,
    selectedSortType,
    setSelectedSortType,
    isOrderedAssccendingly=true,
    setIsOrderedAscendingly,
    priceRange,
    setPriceRange,
    onFitersCleared=()=>{}
}) {
    const [isSortSelectorOpened, setIsSortSelectorOpened] = useState(false);
    return (
        <div className="px-4 flex flex-col gap-y-5 w-full max-w-[300px]">
            <div>
                <Accordion type="single" collapsible>
                    <AccordionItem value="item-1">
                        <AccordionTrigger>Category</AccordionTrigger>
                        <AccordionContent>
                            <div className="pl-2 flex flex-col gap-y-1">
                                <button
                                className={`text-left ${category==='All'?'underline text-blue-500':''} 
                                ${category==='All'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('All')}
                                >
                                    All
                                </button>
                                <button
                                className={`text-left ${category==='Wears'?'underline text-blue-500':''} 
                                ${category==='Wears'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('Wears')}
                                >
                                    Wears
                                </button>
                                <button
                                className={`text-left ${category==='Furniture'?'underline text-blue-500':''} 
                                ${category==='Furniture'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('Furniture')}
                                >
                                    Furniture
                                </button>
                                <button
                                className={`text-left ${category==='Electronics'?'underline text-blue-500':''} 
                                ${category==='Electronics'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('Electronics')}
                                >
                                    Electronics
                                </button>
                                <button
                                className={`text-left ${category==='Home Appliances'?'underline text-blue-500':''} 
                                ${category==='Home Appliances'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('Home Appliances')}
                                >
                                    Home Appliances
                                </button>
                                <button
                                className={`text-left ${category==='Food'?'underline text-blue-500':''} 
                                ${category==='Food'?'':'hover:font-semibold'}`}
                                onClick={()=>setCategory('Food')}
                                >
                                    Food
                                </button>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="w-[50%] min-w-[100px]">
                <SortTypeSelector
                sortTypes={sortTypes}
                isOpened={isSortSelectorOpened}
                setIsOpened={setIsSortSelectorOpened}
                value={selectedSortType}
                setValue={setSelectedSortType}
                />
            </div>
            <div className="w-[50%] min-w-[100px]">
                <h3 className="font-medium">Order In</h3>
                <ul className="pl-2">
                    <li>
                        <div className="flex gap-x-1">
                            <input 
                            type="radio" 
                            name="order" 
                            id="ascendingOrder" 
                            checked={isOrderedAssccendingly}
                            onChange={()=>{
                                setIsOrderedAscendingly(true)
                            }}
                            />
                            <label htmlFor="ascendingOrder">Asc</label>
                        </div>
                    </li>
                    <li>
                        <div className="flex gap-x-1">
                            <input 
                            type="radio" 
                            name="order" 
                            id="descendingOrder" 
                            checked={!isOrderedAssccendingly}
                            onChange={()=>{
                                setIsOrderedAscendingly(false)
                            }}
                            />
                            <label htmlFor="descendingOrder">Desc</label>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="w-[50%] min-w-[100px]">
                <h3 className="font-medium">Price Upto</h3>
                <div className="pl-2">
                    <p>{
                        new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',})
                        .format(priceRange)
                    }</p>
                    <input 
                    className="h-[2px] cursor-pointer"
                    type="range" 
                    name="" 
                    id="" 
                    min={0} 
                    max={500000} 
                    value={priceRange}
                    onChange={(e)=>setPriceRange(e.target.value)}
                    />
                </div>
            </div>
            <Button
            onClick={onFitersCleared}
            text="Clear Filter"
            background="bg-red-500 hover:bg-red-700"
            className="w-fit"
            />
        </div>
    )
}