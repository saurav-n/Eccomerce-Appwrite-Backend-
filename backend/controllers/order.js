import User from "../models/user.js";
import Order from "../models/order.js";
import Address from "../models/address.js";
const createOrder = async (req, res) => {
  try {
    const { addressId } = req.body;
    const user = await User.findById(req.user.id);
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "addressId is required",
      });
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    if (String(address.owner) !== String(user._id)) {
      return res.status(401).json({
        success: false,
        message: "You haven't added this address to your account",
      });
    }

    if (user.carts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "You have no items in your cart",
      });
    }

    const newOrder = await Order.create({
      owner: req.user.id,
      address: address._id,
      products: user.carts.map((cartItem) => {
        return {
          item: cartItem.itemId,
          qty: cartItem.qty,
        };
      }),
    });

    if (!newOrder) {
      return res.status(400).json({
        success: false,
        message: "Order creation failed",
      });
    }

    user.carts = [];
    user.cartItemQty = 0;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      data: {
        order: newOrder,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const confirmOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    order.status = "confirmed";
    order.paymentStatus = "success";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order confirmed successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    order.paymentStatus = "failed";
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order rejected successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {  status } = req.body;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
    if (!["confirmed", "processing", "shipped", "delivered"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    order.status = status;
    await order.save();
    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getOrderIdFromPidx = async (req, res) => {
  try {
    const { pidx } = req.params;
    if (!pidx) {
      return res.status(400).json({
        success: false,
        message: "pidx is required",
      });
    }
    const order = await Order.findOne({ pidx });
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order found successfully",
      data: {
        orderId: order._id,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getOrder = async (req, res) => {
  try {
    const { orderId } = req.prams;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order found successfully",
      data: {
        order,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { createOrder, confirmOrder, rejectOrder, getOrderIdFromPidx, getOrder, updateOrderStatus };
