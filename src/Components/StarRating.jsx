import { FaRegStar } from "react-icons/fa";
import { FaStarHalfAlt } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { itemDbService } from "@/appwriteServices/database/itemDb";
import { itemActions } from "@/app/itemSlice";
import { useDispatch } from "react-redux";
import { useToast } from "@/Components/Toast/use-toast"
export default function StarRating({ item,currUser }) {
    let dummyRating = parseFloat(item.rating)
    const ratingArr = Array.from([0, 0, 0, 0, 0], (elem) => {
        if (dummyRating >= 1) {
            dummyRating--
            return 1
        }
        else if(dummyRating>0){
            const dummyRatingCpy=dummyRating
            dummyRating=0
            return dummyRatingCpy>=0.5?0.5:0
        }
        return 0
    })
    const dispatch = useDispatch()
    const ratingFunction = async (starVal) => {
        const ratingInt = parseFloat(item.rating)
        const updatedRaters=item.raters.includes(currUser.$id)?item.raters:[...item.raters,currUser.$id]
        const updatedAllRatings=item.raters.includes(currUser.$id)?
            item.raters.map((raterId,indx)=>{
                if(raterId===currUser.$id) return starVal
                return item.allRatings[indx]
            }):
            [...item.allRatings,starVal]
        const updatedNoOfRatings = item.raters.includes(currUser.$id)?item.noOfRatings:item.noOfRatings+1
        const prevRating=item.raters.includes(currUser.$id)?item.allRatings[item.raters.indexOf(currUser.$id)]:0
        const newRating = ((ratingInt*item.noOfRatings + starVal-prevRating) / updatedNoOfRatings).toFixed(1)
        const updatedItem = await itemDbService.updateItem({
            ...item,
            itemId:item.$id,
            rating: newRating,
            noOfRatings: updatedNoOfRatings,
            raters:updatedRaters,
            allRatings:updatedAllRatings
        })
        dispatch(itemActions.updateItem({ id: updatedItem.$id, updatedItem }))
    }
    const {toast}=useToast()
    return (
        <div className="flex gap-x-2">
            <div className="flex gap-x-1">
                {
                    ratingArr.map((currRating, index) => (
                        <button 
                        key={index}
                        className="text-yellow-400 text-base hover:text-lg"
                        onClick={()=>{
                            ratingFunction(index+1)
                            toast({
                                description: `You rated ${index+1} star to this item`,
                            })
                        }}
                        >
                            {
                                currRating===1?<FaStar/>:currRating===0?<FaRegStar/>:<FaStarHalfAlt/>
                            }
                        </button>
                    ))
                }
            </div>
            <p className="text-base">{item.rating}</p>
        </div>
    )
}