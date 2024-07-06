import { useSelector } from "react-redux";
import Login from "../Components/Login";

export default function Account(){
    const allOrders=useSelector(state=>state.order.orders)
    const userData=useSelector(state=>state.auth.userData)
    const authStatus=useSelector(state=>state.auth.status)
    
    const userOrders=allOrders.filter(order=>order.customerId===userData.$id)

    return(
        <div className="w-full px-2 min-h-[600px] flex flex-wrap justify-center items-center">
            {
                authStatus?<p>all your orders</p>:
                <Login relocatePath={'account'}/>
            }
        </div>
    )
}