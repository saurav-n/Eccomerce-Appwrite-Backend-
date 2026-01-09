import axios from "axios"
import { useEffect } from "react"
import { useSearchParams, useParams } from "react-router-dom"

export default function PaySuccess() {

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