import axios from "axios"
import { useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"

export default function PaySuccess() {

    const [searchParams, setSearchParams] = useSearchParams()
    const pidx=searchParams.get('pidx')

    useEffect(()=>{
        const confirmOrder=async()=>{
            try {
                const orderResponse=await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/order/orderIdFromPidx/${pidx}`,{
                    headers:{
                        'Authorization':`Bearer ${localStorage.getItem('token')}`
                    }
                })
    
                const orderId=orderResponse.data.data.orderId
                console.log('orderId',orderId)
                a
            } catch (error) {
                
            }

        }
        confirmOrder()
    })
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-center">Payment Successful</h1>
      <p className="text-center">
        Thank you for your purchase! Your order has been placed and will be
        delivered shortly.
      </p>
    </div>
  )
}