import { FaRegStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { itemDbService } from "@/appwriteServices/database/itemDb";
import { fetchItems, itemActions } from "@/app/itemSlice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/Components/Toast/use-toast"
import useSession from "@/hooks/session";
import axios from "axios";
import { useEffect, useState } from "react";
export default function StarRating({ itemId,rating }) {
    const { status, data } = useSession()
    const [ratingArr,setRatingArr]=useState([])
    const dispatch = useDispatch()

    useEffect(()=>{
        let dummyRating=rating
        setRatingArr(Array.from([0, 0, 0, 0, 0], (elem) => {
            if (dummyRating >= 1) {
                dummyRating--
                return 1
            }
            else if (dummyRating > 0) {
                const ratingCpy = dummyRating
                dummyRating = 0
                return ratingCpy >= 0.5 ? 0.5 : 0
            }
            return 0
        }))
    },[rating])


    const ratingFunction = async (starVal) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/rateItem`, {
                itemId,
                userRate: starVal
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (res.data.success) {
                toast({
                    variant: "default",
                    title: "Item rated successfully"
                })
                dispatch(fetchItems({}))
            }
        } catch (error) {
            toast({
                description: error.response?.data?.message || 'Something went wrong',
                variant: "destructive"
            })
        }

    }
    const { toast } = useToast()
    return (
        <>
            {ratingArr.length>0 && <div className="flex gap-x-2">
                <div className="flex gap-x-1">
                    {
                        ratingArr.map((currRating, index) => (
                            <button
                                key={index}
                                className="text-yellow-400 text-base hover:text-lg"
                                onClick={() => {
                                    ratingFunction(index + 1)
                                    toast({
                                        description: `You rated ${index + 1} star to this item`,
                                    })
                                }}
                            >
                                {
                                    currRating === 1 ? <FaStar /> : currRating === 0 ? <FaRegStar /> : <FaStarHalfAlt />
                                }
                            </button>
                        ))
                    }
                </div>
                <p className="text-base">{rating}</p>
            </div>}
        </>
    )
}