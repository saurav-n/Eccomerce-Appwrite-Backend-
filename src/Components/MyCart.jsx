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
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
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
export default function myCart() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const userData = useSelector(state => state.auth.userData)
    const users = useSelector(state => state.user.users)
    const [currentUser] = users.filter(user => userData && user.accountId === userData.$id)
    const items = useSelector(state => state.item.items)
    const [isSortSelectorOpened, setIsSortSelectorOpened] = useState(false);
    const [selectedSortType, setSelectedSortType] = useState('');
    const [isQtyIncreasing, setIsQtyIncreasing] = useState(false);
    const [isQtyDecreasing, setIsQtyDecreasing] = useState(false);
    const [isItemRemoving, setisItemRemoving] = useState(false);
    const [isCartClearing, setisCartClearing] = useState(false);
    const [activeCartItem, setActiveCartItem] = useState(-1);
    const [isItemQtyChanged, setisItemQtyChanged] = useState(false);
    const sortTypes = [
        {
            value: 'byName',
            label: 'By Name'
        },
        {
            value: 'byQuantity',
            label: 'By Quantity'
        },
        {
            value: 'byPrice',
            label: 'By Price'
        }
    ]
    const [cartItems, setCartItems] = useState(currentUser?.carts.map((itemId, index) => {
        return {
            item: mapItemIdToItem(itemId, items),
            qty: currentUser.cartItemQty[index]
        }
    }));
    console.log(cartItems) 
    useEffect(()=>{
        if(selectedSortType==='byName'){
            setCartItems(cartItems.toSorted((aCartItem,bCartItem)=>nameCompare(aCartItem.item.name,bCartItem.item.name)))
        }else if(selectedSortType==='byQuantity'||(isItemQtyChanged&&selectedSortType==='byQuantity')){
            console.log('arranging by qty')
            setCartItems(
                cartItems.toSorted((aCartItem,bCartItem)=>aCartItem.qty-bCartItem.qty)
            )
            if(isItemQtyChanged) setisItemQtyChanged(false)
        }else if(selectedSortType==='byPrice'){
            setCartItems(
                cartItems.toSorted((aCartItem,bCartItem)=>
                    parseInt(aCartItem.item.price.slice(3))-parseInt(bCartItem.item.price.slice(3))
                )
            )
        }
    },[selectedSortType,isItemQtyChanged])
    return (
        <div className="w-full h-full py-10 flex items-center justify-center">
            <div className="flex flex-col items-center w-full max-w-[800px] px-2 gap-y-5">
                {
                    cartItems?.length?(
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
                                    <TableCell>{'Quantity'}</TableCell>
                                    <TableCell>{'SubTotal'}</TableCell>
                                    <TableCell>{'Remove'}</TableCell>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    cartItems.map((cartItem,index)=>
                                        <TableRow key={cartItem.item.$id}>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-x-1">
                                                    <div className="w-[40px] h-[40px] overflow-hidden rounded-md p-1 border-2
                                                    border-gray-100"
                                                    >
                                                        <img src={`${storageService.getFilePreview(cartItem.item.featuredImgs[0])}`} 
                                                        alt={`${cartItem.item.name}`}/>
                                                    </div>
                                                    <p className="flex items-center text-gray-500 text-left">{cartItem.item.name}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-gray-500">
                                                    {new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',})
                                                        .format(parseInt(cartItem.item.price.slice(3)))
                                                    }
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-x-2">
                                                    <button
                                                    className="hover:scale-125 transition-all"
                                                    onClick={()=>{
                                                        const decreaseQty=async ()=>{
                                                            setIsQtyDecreasing(prev=>!prev)
                                                            setActiveCartItem(index)
                                                            try {
                                                                if(cartItem.qty>1){
                                                                    const updatedItem=await itemDbService.updateItem({
                                                                        itemId:cartItem.item.$id,
                                                                        ...cartItem.item,
                                                                        maxQty:(parseInt(cartItem.item.maxQty)+1).toString()
                                                                    })
                                                                    const updatedUser=await userDbService.updateUser({
                                                                        userId:currentUser.$id,
                                                                        ...currentUser,
                                                                        cartItemQty:currentUser?.carts.map((itemId,index)=>
                                                                    cartItem.item.$id===itemId?cartItem.qty-1:
                                                                            currentUser.cartItemQty[index]
                                                                        )
                                                                    })
                                                                    dispatch(
                                                                        itemActions.updateItem({id:cartItem.item.$id,updatedItem})
                                                                    )
                                                                    dispatch(
                                                                        userActions.updateUser({id:currentUser.accountId,updatedUser}
                                                                    ))
                                                                    setCartItems(cartItems.map(arrayItem=>
                                                                        arrayItem.item.$id===cartItem.item.$id?{
                                                                            item:{
                                                                                ...cartItem.item,
                                                                                 maxQty:(parseInt(cartItem.item.maxQty)+1).toString()
                                                                            },
                                                                            qty:cartItem.qty-1
                                                                        }:arrayItem
                                                                    ))
                                                                    setisItemQtyChanged(true)
                                                                }
                                                            } catch (error) {
                                                                console.log(error)
                                                            }finally{
                                                                setIsQtyDecreasing(prev=>!prev)
                                                                setActiveCartItem(-1)
                                                            }
                                                        }
                                                        decreaseQty()
                                                    }}
                                                    disabled={isCartClearing||isItemRemoving||isQtyDecreasing||isQtyIncreasing}
                                                    >
                                                        {
                                                            isQtyDecreasing&&activeCartItem===index?(
                                                                <Loader/>
                                                            ):(
                                                                <FaMinus/>
                                                            )
                                                        }
                                                    </button>
                                                    <p className="text-blue-500">{cartItem.qty}</p>
                                                    <button
                                                    className="hover:scale-125 transition-all"
                                                    onClick={()=>{
                                                        const increaseQty=async ()=>{
                                                            setIsQtyIncreasing(prev=>!prev)
                                                            setActiveCartItem(index)
                                                            try {
                                                                if(parseInt(cartItem.item.maxQty)>0){
                                                                    const updatedItem=await itemDbService.updateItem({
                                                                        itemId:cartItem.item.$id,
                                                                        ...cartItem.item,
                                                                        maxQty:(parseInt(cartItem.item.maxQty)-1).toString()
                                                                    })
                                                                    const updatedUser=await userDbService.updateUser({
                                                                        userId:currentUser.$id,
                                                                        ...currentUser,
                                                                        cartItemQty:currentUser?.carts.map((itemId,index)=>
                                                                            cartItem.item.$id===itemId?cartItem.qty+1:
                                                                            currentUser.cartItemQty[index]
                                                                        )
                                                                    })
                                                                    dispatch(
                                                                        itemActions.updateItem({id:cartItem.item.$id,updatedItem})
                                                                    )
                                                                    dispatch(
                                                                        userActions.updateUser({id:currentUser.accountId,updatedUser})
                                                                    )
                                                                    setCartItems(cartItems.map(arrayItem=>
                                                                        arrayItem.item.$id===cartItem.item.$id?{
                                                                            item:{
                                                                                ...cartItem.item,
                                                                                maxQty:(parseInt(cartItem.item.maxQty)-1).toString()
                                                                            },
                                                                            qty:cartItem.qty+1
                                                                        }:arrayItem
                                                                    ))
                                                                    setisItemQtyChanged(true)
                                                                } 
                                                            } catch (error) {
                                                                console.log(error)
                                                            }finally{
                                                                setIsQtyIncreasing(prev=>!prev)
                                                                setActiveCartItem(-1)
                                                            }
                                                        }
                                                        increaseQty()
                                                    }}
                                                    disabled={isCartClearing||isItemRemoving||isQtyIncreasing||isQtyDecreasing}
                                                    >
                                                        {
                                                            isQtyIncreasing&&activeCartItem===index?(
                                                                <Loader/>
                                                            ):(
                                                                <FaPlus/>
                                                            )
                                                        }
                                                    </button>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p>
                                                    {new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',})
                                                    .format(parseInt(cartItem.item.price.slice(3))*cartItem.qty)}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="rounded-full w-7 h-7 flex justify-center items-center hover:bg-gray-100
                                                transition-all mx-auto"
                                                >
                                                    <button
                                                    className="text-red-500 group hover:scale-125 transition-all"
                                                    onClick={()=>{
                                                        const removeItem=async ()=>{
                                                            setisItemRemoving(prev=>!prev)
                                                            setActiveCartItem(index)
                                                            try {

                                                                const updatedItem=await itemDbService.updateItem({
                                                                    itemId:cartItem.item.$id,
                                                                    ...cartItem.item,
                                                                    maxQty:(parseInt(cartItem.item.maxQty)+cartItem.qty).toString()
                                                                })
                                                                const updatedUser=await userDbService.updateUser({
                                                                    userId:currentUser.$id,
                                                                    ...currentUser,
                                                                    carts:currentUser?.carts.filter(itemId=>itemId!==cartItem.item.$id),
                                                                    cartItemQty:currentUser?.cartItemQty.filter((itemQty,index)=>
                                                                        currentUser?.carts[index]!==cartItem.item.$id
                                                                    )
                                                                })
                                                                setCartItems(
                                                                    cartItems.filter(arrayItem=>arrayItem.item.$id!==cartItem.item.$id)
                                                                )
                                                                dispatch(
                                                                    itemActions.updateItem({id:cartItem.item.$id,updatedItem})
                                                                )
                                                                dispatch(
                                                                    userActions.updateUser({id:currentUser.accountId,updatedUser})
                                                                )
                                                            } catch (error) {
                                                                console.log(error)
                                                            }finally{
                                                                setisItemRemoving(prev=>!prev)
                                                                setActiveCartItem(-1)
                                                            }
                                                        }
                                                        removeItem()
                                                    }}
                                                    disabled={isItemRemoving||isCartClearing||isQtyIncreasing||isQtyDecreasing}
                                                    >
                                                        {
                                                            isItemRemoving&&activeCartItem===index?(
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
                                            const itemsToBeUpdatedAs=items.map(item=>{
                                                const itemIndxInCartItem=currentUser?.carts.findIndex(itemId=>itemId===item.$id)
                                                return currentUser?.carts.includes(item.$id)?{
                                                    ...cartItems[itemIndxInCartItem].item,
                                                    maxQty:(parseInt(cartItems[itemIndxInCartItem].item.maxQty)+
                                                    cartItems[itemIndxInCartItem].qty).toString()
                                                }:item
                                            })
                                            const updatedItems=await itemDbService.updateAllItems(itemsToBeUpdatedAs)
                                            const updatedUser=await userDbService.updateUser({
                                                userId:currentUser.$id,
                                                ...currentUser,
                                                carts:[],
                                                cartItemQty:[]
                                            })
                                            setCartItems([])
                                            dispatch(itemActions.updateAllItems(updatedItems))
                                            dispatch(userActions.updateUser({id:currentUser.accountId,updatedUser}))
                                        } catch (error) {
                                            console.log(error)
                                        }finally{
                                            setisCartClearing(prev=>!prev)
                                        }
                                    }
                                    removeAllItems()
                                }}
                                disabled={isCartClearing||isItemRemoving||isQtyIncreasing||isQtyDecreasing}
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
                                            new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',}).
                                            format(currentUser?.cartItemQty.reduce((acc,crrQty,index)=>
                                                acc+(parseInt(cartItems[index].item.price.slice(3))*crrQty)
                                            ,0))
                                            }`
                                        }
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        <span className="font-bold">Shipping Fee:</span>
                                        {
                                            ` ${new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',}).
                                            format(currentUser?.cartItemQty.reduce((acc,currQty)=>
                                                acc+currQty
                                            ,0)*5)}(5/Item)`
                                        }
                                    </p>
                                    <div className="w-full bg-gray-400 h-[0.8px] my-3"></div>
                                    <p className="text-xs text-gray-500">
                                        <span className="font-bold">Grand Total:</span>
                                        {
                                            ` ${new Intl.NumberFormat('ne-NP', {style: 'currency',currency: 'NPR',}).
                                            format(currentUser?.cartItemQty.reduce((acc,crrQty,index)=>
                                                acc+(parseInt(cartItems[index].item.price.slice(3))*crrQty)
                                            ,0)+(currentUser?.cartItemQty.reduce((acc,currQty)=>
                                                acc+currQty
                                            )*5))}`
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
