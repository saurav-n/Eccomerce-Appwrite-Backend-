import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import { useToast } from './Toast/use-toast'
import axios from 'axios'
import { fetchItems } from '@/app/itemSlice'
import { useState } from 'react'
import Loader from './Loader'
import { useNavigate } from 'react-router'

export default function AdminDisplayCart({ item}) {
    const dispatch=useDispatch()
    const {toast}=useToast()
    const [isDeleting,setIsDeleting]=useState(false)
    const navigate=useNavigate()

    const handleDelete=async(itemId)=>{
        try {
            setIsDeleting(true)
            const response=await axios.delete(`http://localhost:3000/api/admin/deleteItem?itemId=${itemId}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                }
            })
            if(response.status===200){
                toast({
                    variant:"default",
                    title:"Success",
                    description:"Item deleted successfully"
                })
                dispatch(fetchItems())
            }
        } catch (error) {
            toast({
                variant:"destructive",
                title:"Error",
                description:error.response?.data?.message || "Something went wrong"
            })
        }
        finally{
            setIsDeleting(false)
        }
    }
    
    return (
        <div className="w-full max-w-[300px] bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="relative">
                <img 
                    src={item.featuredImgs[0]} 
                    alt={item.name}
                    className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                    <button 
                        onClick={()=>handleDelete(item._id)}
                        disabled={isDeleting}
                        className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Delete Item"
                    >
                        {isDeleting?<Loader/>:<IoTrashOutline className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                    <span className="text-sm text-gray-600">{item.price}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {item.category.toUpperCase()}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                    <button 
                        onClick={()=>navigate(`/updateProduct/${item._id}`)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                        <IoPencilOutline className="w-4 h-4" />
                        Edit
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Stock:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {item.stock}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}