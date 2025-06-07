import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Container from "./Container";
import { storageService } from "@/appwriteServices/storage";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/table"
import Loader from "./Loader";
import { MdDelete } from "react-icons/md";
import { itemDbService } from "@/appwriteServices/database/itemDb";
import { userDbService } from "@/appwriteServices/database/userDb";
import { userActions } from "@/app/userSlice";
import { itemActions } from "@/app/itemSlice";
import mapItemIdToItem from "@/utils/itemMap";
import Button from "./Button";
import SortTypeSelector from "./SortTypeSelector";
import { useNavigate } from "react-router";
import nameCompare from "@/utils/NameCompare";
import useSession from "@/hooks/session"
import axios from "axios";
import { useToast } from "./Toast/use-toast";
import { fetchItems } from "@/app/itemSlice";
import { fetchUsers } from "@/app/userSlice";
export default function myCart() {
    const {toast}=useToast()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {status,data}=useSession()
    const {items,isLoading:isItemsLoading,error:itemsError}=useSelector(state=>state.item)
    const [isSortSelectorOpened, setIsSortSelectorOpened] = useState(false);
    const [selectedSortType, setSelectedSortType] = useState('');
    const [isItemRemoving, setisItemRemoving] = useState(false);
    const [isCartClearing, setisCartClearing] = useState(false);
    const [activeItem, setActiveItem] = useState(null);
    const {users,isLoading:isUsersLoading,error:usersError}=useSelector(state=>state.user)
    const [currUser,setCurrUser]=useState(null)
    const sortTypes = [
        {
            value: 'byName',
            label: 'By Name'
        },
        {
            value: 'byPrice',
            label: 'By Price'
        }
    ]
    const [cartItems, setCartItems] = useState(null);
    console.log(cartItems) 
    useEffect(()=>{
        if(selectedSortType==='byName'){
            setCartItems(cartItems.toSorted((aCartItem,bCartItem)=>nameCompare(aCartItem.item.name,bCartItem.item.name)))
        }else if(selectedSortType==='byPrice'){
            setCartItems(
                cartItems.toSorted((aCartItem,bCartItem)=>
                    aCartItem.item.price-bCartItem.item.price
                )
            )
        }
    },[selectedSortType])

    useEffect(()=>{
        if(status==='authenticated'&&currUser&&items&&items.length){
            console.log(items)
            setCartItems(currUser.carts.map(cartItem=>{
                return {
                    item:items.find(item=>item._id===cartItem.itemId),
                    qty:cartItem.qty
                }
            }))
        }
    },[currUser,items])

    useEffect(()=>{
        console.log(users)
        if(status==='authenticated'&&data?.user &&users&&users.length){
            setCurrUser(users.find(user=>user._id===data.user._id))
        }
    },[status,data,users])

    useEffect(()=>{
        console.log('fetching')
        dispatch(fetchItems())
        dispatch(fetchUsers())
    },[dispatch])
    return (
        <div className="w-full h-full py-10 flex items-center justify-center">
            <div className="flex flex-col items-center w-full max-w-[800px] px-2 gap-y-5">
                {
                    itemsError?<p>{itemsError}</p>:isItemsLoading || !currUser || !cartItems?<Loader/>:cartItems?.length?(
                    <>
                        <div className="w-full flex justify-center sm:flex-row-reverse sm:justify-normal">
                            <SortTypeSelector
                                sortTypes={sortTypes}
                                isOpened={isSortSelectorOpened}
                                setIsOpened={setIsSortSelectorOpened}
                                value={selectedSortType}
                                setValue={setSelectedSortType}
                            />
                        </div>
                        <Table className="text-center">
                            <TableHeader>
                                <TableRow>
                                    <TableCell>{'Item'}</TableCell>
                                    <TableCell>{'Price'}</TableCell>
                                    <TableCell>{'Qty'}</TableCell>
                                    <TableCell>{'Remove'}</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cartItems.map((cartItem,index)=>
                                        <TableRow key={cartItem.item._id}>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-x-1">
                                                    <div className="w-[40px] h-[40px] overflow-hidden rounded-md p-1 border-2
                                                    border-gray-100"
                                                    >
                                                        <img src={cartItem.item.featuredImgs[0]} 
                                                        alt={cartItem.item.name}/>
                                                    </div>
                                                    <p className="flex items-center text-gray-500 text-left">{cartItem.item.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-gray-500">
                                                    {new Intl.NumberFormat({style: 'currency',currency: 'NPR',})
                                                        .format(cartItem.item.price)}
                                                </p>
                                            </TableCell>
                                            <TableCell>{cartItem.qty}</TableCell>
                                            <TableCell>
                                                <div className="rounded-full w-7 h-7 flex justify-center items-center hover:bg-gray-100
                                                transition-all mx-auto"
                                                >
                                                    <button
                                                    className="text-red-500 group hover:scale-125 transition-all"
                                                    onClick={()=>{
                                                        const removeItem=async ()=>{
                                                            setActiveItem(index)
                                                            setisItemRemoving(prev=>!prev)
                                                            try {
                                                                const response=await axios.post("http://localhost:3000/api/user/removeItemFromCart",{
                                                                    itemId:cartItem.item._id,
                                                                },{
                                                                    headers:{
                                                                        'Authorization':`Bearer ${localStorage.getItem('token')}`
                                                                    }
                                                                })

                                                                if(response.data.success){
                                                                    toast({
                                                                        variant:"default",
                                                                        title:"Item removed from cart"
                                                                    })
                                                                    dispatch(fetchUsers())
                                                                    dispatch(fetchItems())
                                                                }
                                                            } catch (error) {
                                                                toast({
                                                                    variant:"destructive",
                                                                    title:error.response?.data?.message || 'Something went wrong'
                                                                })
                                                            }finally{
                                                                setisItemRemoving(prev=>!prev)
                                                            }
                                                        }
                                                        removeItem()
                                                    }}
                                                    disabled={isItemRemoving||isCartClearing}
                                                    >
                                                        {
                                                            isItemRemoving&&activeItem===index?(
                                                                <Loader/>
                                                            ):(
                                                                <MdDelete/>
                                                            )
                                                        }
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }
                            </TableBody>
                        </Table>
                        <div className="w-full flex justify-between flex-wrap gap-y-1">
                                <Button
                                text="Continue Shopping"
                                className="w-fit"
                                onClick={()=>{
                                    navigate('/product')
                                }}
                                />
                                <Button
                                text={isCartClearing?'Clearing...':'Clear Cart'}
                                className="w-fit"
                                background="bg-red-500 hover:bg-red-700"
                                onClick={()=>{
                                    const removeAllItems=async ()=>{
                                        setisCartClearing(prev=>!prev)
                                        try {
                                            const response=await axios.post("http://localhost:3000/api/user/clearCart",{
                                                
                                            },{
                                                headers:{
                                                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                                                }
                                            })
                                            if(response.data.success){
                                                toast({
                                                    variant:"default",
                                                    title:"Cart cleared successfully"
                                                })
                                                dispatch(fetchUsers())
                                                dispatch(fetchItems())
                                            }
                                        } catch (error) {
                                            toast({
                                                variant:"destructive",
                                                title:error.response?.data?.message || 'Something went wrong'
                                            })
                                        }finally{
                                            setisCartClearing(prev=>!prev)
                                        }
                                    }
                                    removeAllItems()
                                }}
                                disabled={isCartClearing||isItemRemoving}
                                >
                                    {
                                        isCartClearing?(<Loader/>):''
                                    }
                                </Button>
                        </div>
                        <div className="w-full flex flex-row-reverse">
                                <div className="w-full max-w-[200px] p-2 bg-gray-200 rounded-md flex flex-col gap">
                                    <p className="text-xs text-gray-500">
                                        <span className="font-bold">Order Total:</span>
                                        {
                                            ` ${
                                            new Intl.NumberFormat({style: 'currency',currency: 'NPR',}).
                                            format(cartItems.reduce((totalPrice,cartItem)=>
                                                totalPrice+cartItem.item.price*cartItem.qty
                                            ,0))
                                            }`
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        <span className="font-bold">Shipping Fee:</span>
                                        {
                                            ` ${new Intl.NumberFormat({style: 'currency',currency: 'NPR',}).
                                            format(currUser.cartItemQty*5)}(5/Item)`
                                        }
                                    </p>
                                    <div className="w-full bg-gray-400 h-[0.8px] my-3"></div>
                                    <p className="text-xs text-gray-500">
                                        <span className="font-bold">Grand Total:</span>
                                        {
                                            ` ${new Intl.NumberFormat({style: 'currency',currency: 'NPR',}).
                                            format(cartItems.reduce((totalPrice,cartItem)=>
                                                totalPrice+cartItem.item.price*cartItem.qty
                                            ,0)+currUser.cartItemQty*5)}`
                                        }
                                    </p>
                                </div>
                        </div>
                    </>):<p>You dont have any cart Items</p>
                }
            </div>
        </div>
    )
}
