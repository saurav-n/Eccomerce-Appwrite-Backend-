import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import Container from "./Container"
import AppLoader from "./appLoader"
import AdminDisplayCart from "./AdminDisplayCart"
import { fetchItems } from "@/app/itemSlice"

export default function AdminLanding() {
    const {items,isLoading,error}=useSelector((state)=>state.item)
    const dispatch=useDispatch()
    
    useEffect(()=>{
        dispatch(fetchItems())
    },[dispatch])


    return(
        <Container>
            {error?<p>{error}</p>:isLoading?<AppLoader/>:(
                <div className="w-full flex flex-col gap-y-4 p-3">
                <h2 className="text-2xl font-bold mb-4">All Items</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 p-4">
                    {items.map((item) => (
                        <div key={item._id} className="w-full">
                            <AdminDisplayCart 
                                item={item} 
                            />
                        </div>
                    ))}
                </div>
                </div>
            )}
        </Container>
    )
}