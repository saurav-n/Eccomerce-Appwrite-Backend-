import Order from "../models/order.js";

const isAuthorizedToOrder = async (req, res, next) => {
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
    if(req.user.role!="admin" && order.owner.toString()!=req.user._id.toString()){
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    return next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { isAuthorizedToOrder };
