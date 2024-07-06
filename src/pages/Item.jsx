import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userActions } from "../app/userSlice";
import { itemActions } from "@/app/itemSlice";
import { userDbService } from "../appwriteServices/database/userDb";
import { itemDbService } from "@/appwriteServices/database/itemDb";
import { useParams } from "react-router";
import Container from "../Components/Container";
import { storageService } from "@/appwriteServices/storage";
import { secImagesDBService } from "@/appwriteServices/database/secImagesDb";
import StarRating from "@/Components/StarRating";
import ItemPropertyBadge from "@/Components/itemPropertyBadge";
import { MdDeliveryDining } from "react-icons/md";
import { TbReplaceFilled } from "react-icons/tb";
import { VscWorkspaceTrusted } from "react-icons/vsc";
import { FaPlus } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import Button from "@/Components/Button";
import { useToast } from "@/Components/Toast/use-toast";

export default function Item() {
    const { itemId } = useParams()
    const allItems = useSelector(state => state.item.items)
    const userData = useSelector(state => state.auth.userData)
    const allUsers = useSelector(state => state.user.users)
    const [currentUser] = allUsers.filter(user => userData && user.accountId === userData.$id)
    const [openedItem] = allItems.filter(item => item.$id === itemId)
    const [itemImages, setItemImages] = useState([openedItem.featuredImgs[0]]);
    const [mainImage, setMainImage] = useState(openedItem.featuredImgs[0]);
    const [orderQty, setOrderQty] = useState(parseInt(openedItem.maxQty)>=1?1:0);
    const dispatch = useDispatch()
    const {toast}=useToast()

    useEffect(() => {
        async function fetchImages() {
            try {
                const secImagesDcouments = (await secImagesDBService.getImages(itemId)).documents
                const secImages = secImagesDcouments.map(imgDocument => imgDocument?.imageId)
                setItemImages([...itemImages, ...secImages])
            } catch (error) {
                console.log(error)
            }
        }
        fetchImages()
    }, [])

    return (
        <Container>
            <div className="w-full flex justify-center items-center py-10">
                <div className="w-full max-w-[400px] flex flex-col items-center  gap-y-10 gap-x-3 sm:flex-row">
                    <div className="w-full flex flex-wrap items-center justify-center sm:flex-col">
                        {
                            itemImages.map((img, indx) => {
                                return (
                                    <button className="w-1/4 min-w-[100px] h-[100px]" key={indx} onClick={() => setMainImage(img)}>
                                        <div className="w-full h-full overflow-hidden p-1 border-2 border-gray-100 rounded-md
                                            hover:border-slate-400 transition-all">
                                            <img src={storageService.getFilePreview(img)} alt={openedItem.name}
                                                className="w-full h-full object-contain" />
                                        </div>
                                    </button>
                                )
                            })
                        }
                    </div>
                    <div className="w-full max-w-[300px] flex flex-col items-center gap-y-2 px-1">
                        <h1 className="text-xl font-semibold">{openedItem.name}</h1>
                        <StarRating item={openedItem} currUser={currentUser}/>
                        <div className="w-full max-w-[200px] h-[200px] overflow-hidden p-2 border-2 rounded-md border-slate-300">
                            <img src={storageService.getFilePreview(mainImage)} alt={openedItem.name}
                                className="w-full h-full object-contain" />
                        </div>
                        <p className="font-semibold">{
                            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
                                parseInt(openedItem.price.slice(3))
                            )
                        }</p>
                        <p className="text-sm text-gray-500">{openedItem.desc}</p>
                        <div className="w-full flex flex-wrap gap-x-2 justify-center">
                            <ItemPropertyBadge
                            className={'w-1/3 max-w-[56px]'}
                            badgeDesc={'Free Delivery'}
                            >
                                <MdDeliveryDining/>
                            </ItemPropertyBadge>
                            <ItemPropertyBadge
                            className={'w-1/3 max-w-[56px]'}
                            badgeDesc={'Replacement'}
                            >
                                <TbReplaceFilled/>
                            </ItemPropertyBadge>
                            <ItemPropertyBadge
                            className={'w-1/3 max-w-[56px]'}
                            badgeDesc={'100% warranty'}
                            >
                                <VscWorkspaceTrusted/>
                            </ItemPropertyBadge>
                        </div>
                        <div className="h-[1px] w-full rounded-lg bg-slate-300"></div>
                        <div className="w-full flex flex-col gap-y-2">
                            <p className="text-sm text-gray-500">
                                {`Avialable: ${parseInt(openedItem.maxQty)>0?'In stock':'Out of stock'}`}
                            </p>
                            <div className="flex gap-x-3">
                                <button
                                onClick={()=>{
                                    if(orderQty>0) setOrderQty(prev=>prev-1)
                                }}
                                >
                                    <FaMinus/>
                                </button>
                                <p>{orderQty}</p>
                                <button
                                onClick={()=>{
                                    if(orderQty<parseInt(openedItem.maxQty)) setOrderQty(prev=>prev+1)
                                }}
                                >
                                    <FaPlus/>
                                </button>
                            </div>
                            <Button
                            className={`w-[50%] min-w-[115px] ${orderQty<=0?'bg-gray-400':''}`}
                            onClick={() => {
                                const addToCart = async () => {
                                    try {
                                        if (currentUser.carts.includes(itemId)) {
                                            alert("Item already in cart")
                                        } else {
                                            const updatedUser = await userDbService.updateUser({
                                                userId: currentUser.$id,
                                                accountId: currentUser.accountId,
                                                isSeller: currentUser.isSeller,
                                                searchHistory: currentUser.searchHistory,
                                                carts: [...currentUser.carts,itemId],
                                                cartItemQty:[...currentUser.cartItemQty,orderQty]
                                            })
                                            const updatedItem=await itemDbService.updateItem({
                                                itemId:openedItem.$id,
                                                ...openedItem,
                                                maxQty:(parseInt(openedItem.maxQty)-orderQty).toString()
                                            })
                                            dispatch(userActions.updateUser({ id: updatedUser.accountId, updatedUser }))
                                            dispatch(itemActions.updateItem({ id: openedItem.$id, updatedItem}))
                                            toast({
                                                description:'You added this item to your cart'
                                            })
                                        }
                                    } catch(error){
                                        console.log(error)
                                    }
                                }
                                addToCart()
                            }}
                            text="Add to cart"
                            disabled={orderQty<=0}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}