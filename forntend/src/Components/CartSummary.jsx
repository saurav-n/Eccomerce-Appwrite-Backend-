"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { useToast } from "./Toast/use-toast"
import axios from "axios"
import { useSelector,useDispatch } from "react-redux"
import { fetchAddresses } from "@/app/addressSlice"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";
import { Badge } from "./ui/badge"
import { useNavigate } from "react-router"


export default function CartSummary({ noItems, subtotal }) {
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()
  const {addresses}=useSelector(state=>state.address)
  const [shippingAddress,setShippingAddress]=useState(null)

  useEffect(()=>{
    dispatch(fetchAddresses())
  },[dispatch])

  useEffect(()=>{
    if(addresses && addresses.length>0){
      setShippingAddress(addresses.find(address=>address.isDefault))
    }
  },[addresses])

  const handleKhaltiPayment = async () => {
    if (noItems === 0) {
      toast({
        variant: "destructive",
        title: "Your cart is empty!",
      })
      return
    }

    if(!shippingAddress){
      toast({
        variant: "destructive",
        title: "Please select a shipping address",
      })
      return
    }

    setIsProcessing(true)

    try {
     const orderResponse=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/order`,{
      addressId:shippingAddress._id
     },{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
    })

    console.log('orderResponse',orderResponse)
    if(orderResponse.data.success){
      const khaltiRes=await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/pay/khalti`,{
        amount:subtotal+20*noItems,
        orderId:orderResponse.data.data.order._id,
        orderName:`Order ${orderResponse.data.data.order._id}`
      },{
        headers:{
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        }
      })
      if(khaltiRes.data.success){
        console.log('khaltiRes',khaltiRes)
        toast({
          variant:"default",
          title:"Order placed successfully"
        })

        const redirectUrl=khaltiRes.data.data.paymentUrl
        window.location.href=redirectUrl
      }
    }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        variant: "destructive",
        title:
          error.response?.data?.message ||
          "Something went wrong",
      });
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <aside className="lg:sticky lg:top-8 h-fit">
      <div className="bg-white rounded-lg border border-blue-200 shadow-lg overflow-hidden">
        <div className="bg-blue-700 px-6 py-4">
          <h3 className="text-xl font-bold text-white">Order Summary</h3>
        </div>

        <div className="p-6 space-y-4">
          {/* Items Count */}
          <div className="flex justify-between items-center pb-4 border-b border-blue-100">
            <span className="text-foreground font-medium">Items ({noItems})</span>
            <span className="text-foreground font-semibold">
              Rs. {noItems > 0 ? subtotal.toLocaleString() : 0}
            </span>
          </div>


          {/* Shipping */}
          <div className="flex justify-between items-center pb-4 border-b border-blue-100">
            <span className="text-foreground font-medium">Shipping</span>
            <span className="text-green-600 font-semibold">20/Item</span>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center pb-4 border-b border-blue-100">
            <span className="text-lg font-bold text-foreground">Total</span>
            <span className="text-2xl font-bold text-primary">Rs. {(subtotal+20*noItems).toLocaleString()}</span>
          </div>

          <div className="flex flex-col gap-2 items-center pt-2">
            <label htmlFor="address" className="text-lg font-bold text-foreground self-start">Shipping Address</label>
            <Select
              name="address"
              value={shippingAddress?._id}
              onValueChange={(value) => {
                setShippingAddress(addresses.find(address => address._id === value));
              }}
            >
              <SelectTrigger
                className={`w-full px-4 py-3 rounded-lg border ${
                "border-gray-300"
                } focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              >
                <SelectValue placeholder="Select an address" id="address" />
              </SelectTrigger>
              <SelectContent className="min-h-[40px]">
                {addresses.length?addresses.map((address) => (
                  <SelectItem key={address._id} value={address._id}>
                    <p>{`${address.street}, ${address.city}, ${address.state}`}</p>
                    {address.isDefault && (
                      <Badge className="bg-blue-500 text-white" variant={'Secondary'}>Default</Badge>
                    )}
                  </SelectItem>
                )):(
                   <div className="flex flex-col gap-2 items-center justify-center w-full">
                     <p className="text-center text-foreground font-bold text-base">No addresses found</p>
                     <button
                     onClick={()=>navigate('/account')}
                     className="rounded-md w-full bg-blue-500 hover:bg-blue-600 py-2 text-white transition-all duration-300"
                     >Add Address</button>
                   </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Khalti Button */}
          <button
            onClick={handleKhaltiPayment}
            disabled={isProcessing || noItems === 0}
            className="w-full mt-6 bg-blue-700 hover:from-blue-900 hover:bg-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="animate-spin">⚙️</span> Processing...
              </>
            ) : (
              <>
                <span>💳</span> Pay with Khalti
              </>
            )}
          </button>

          {/* Info Banner */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 flex gap-3">
            <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-900">
              Your payment is secured by Khalti. All transactions are encrypted and safe.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
