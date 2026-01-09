import axios from "axios";
import Order from '../models/order.js';
import paymentQueue from "../lib/queues/paymentQueue.js";

const initiatePaymentKhalti = async (req, res) => {
  try {
    const { amount, orderId, orderName } = req.body;

    if (!amount || !orderId || !orderName) {
      return res.status(400).json({
        success: false,
        message: "Amount, purchaseId and purchaseName are required",
      });
    }
    console.log('Amount ......',amount)
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: "http://localhost:5173/pay/success",
        website_url: "http://localhost:5173",
        amount,
        purchase_order_id: orderId,
        purchase_order_name: orderName,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "key live_secret_key_68791341fdd94846a146f0457ff7b455",
        },
      }
    );

    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.pidx=response.data.pidx
    await order.save()

    console.log(response)
    paymentQueue.add('paymentQueue',{pidx:response.data.pidx})

    return res.status(200).json({
      success: true,
      message: "Payment initiated successfully",
      data: {
        paymentUrl: response.data.payment_url,
      },
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export { initiatePaymentKhalti };