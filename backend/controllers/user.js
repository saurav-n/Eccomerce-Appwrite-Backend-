import User from "../models/user.js";
import Item from "../models/item.js";
import Order from "../models/order.js";
import Address from "../models/address.js";
import mongoose from "mongoose";

const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: {
        users,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updateSearchHistory = async (req, res) => {
  try {
    const { searchedVal } = req.body;
    if (!searchedVal) {
      return res.status(400).json({
        success: false,
        message: "Search value is required",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    user.searchHistory.push(searchedVal);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Search history updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const createOrder = async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    if (!itemId || !qty) {
      return res.status(400).json({
        success: false,
        message: "Item id and quantity are required",
      });
    }
    const item = await Item.findById(new mongoose.Types.ObjectId(itemId));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    const newOrder = await Order.create({
      owner: req.user.id,
      item: itemId,
      qty: qty,
    });
    if (!newOrder) {
      return res.status(400).json({
        success: false,
        message: "Order creation failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    if (!itemId || !qty) {
      return res.status(400).json({
        success: false,
        message: "Item id and quantity are required",
      });
    }

    const itemObjId = new mongoose.Types.ObjectId(itemId);
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const item = await Item.findById(itemObjId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const itemInCart = user.carts.find(
      (cartItem) => String(cartItem.itemId) === String(itemObjId)
    );
    console.log(itemInCart);
    if (itemInCart) {
      return res.status(404).json({
        success: false,
        message: "Item already in cart",
      });
    }

    if (item.stock < qty) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }
    user.carts.push({
      itemId: itemObjId,
      qty: qty,
    });

    user.cartItemQty += qty;
    item.stock -= qty;
    await user.save();
    await item.save();
    return res.status(200).json({
      success: true,
      message: "Item added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updateCartItemQty = async (req, res) => {
  try {
    const { itemId, qty } = req.body;
    if (!itemId || !qty) {
      return res.status(400).json({
        success: false,
        message: "Item id and quantity are required",
      });
    }

    const item = await Item.findById(new mongoose.Types.ObjectId(itemId));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const itemInCart = user.carts.find(
      (cartItem) => String(cartItem.itemId) === String(itemId)
    );
    if (!itemInCart) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    if (qty > item.stock) {
      return res.status(400).json({
        success: false,
        message: "Not enough stock",
      });
    }

    const updatedQty = qty - itemInCart.qty;

    user.carts = user.carts.map((cartItem) =>
      String(cartItem.itemId) === String(itemId)
        ? {
            itemId: new mongoose.Types.ObjectId(itemId),
            qty: qty,
          }
        : cartItem
    );

    user.cartItemQty += updatedQty;
    item.stock -= updatedQty;
    await user.save();
    await item.save();
    return res.status(200).json({
      success: true,
      message: "Item quantity updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const rateItem = async (req, res) => {
  try {
    const { itemId, userRate } = req.body;
    if (!itemId || !userRate) {
      return res.status(400).json({
        success: false,
        message: "Item id and rating are required",
      });
    }

    const item = await Item.findById(new mongoose.Types.ObjectId(itemId));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const hasUserRatedItem = item.ratings.find(
      (rating) => String(rating.ratedBy) === String(req.user.id)
    );
    console.log(userRate);
    console.log(hasUserRatedItem);
    console.log(req.user.id);
    let newRating = [];
    if (hasUserRatedItem) {
      newRating = item.ratings.map((rating) =>
        String(rating.ratedBy) === String(req.user.id)
          ? {
              ratedBy: new mongoose.Types.ObjectId(req.user.id),
              rate: userRate,
            }
          : rating
      );
    } else {
      newRating = [
        ...item.ratings,
        {
          ratedBy: new mongoose.Types.ObjectId(req.user.id),
          rate: userRate,
        },
      ];
    }
    const updatedItem = await Item.findByIdAndUpdate(item._id, {
      ratings: newRating,
    });
    if (!updatedItem) {
      return res.status(400).json({
        success: false,
        message: "Item rating update failed",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Item rated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const removeItemFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item id is required",
      });
    }

    console.log(itemId);

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const item = await Item.findById(new mongoose.Types.ObjectId(itemId));
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    const itemInCart = user.carts.find(
      (cartItem) => String(cartItem.itemId) === String(itemId)
    );
    if (!itemInCart) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    user.carts = user.carts.filter(
      (cartItem) => String(cartItem.itemId) !== String(itemId)
    );
    user.cartItemQty -= itemInCart.qty;
    item.stock += itemInCart.qty;
    await item.save();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Item removed from cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    for (const cartItem of user.carts) {
      const item = await Item.findById(cartItem.itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: "Item not found",
        });
      }
      item.stock += cartItem.qty;
      await item.save();
    }
    user.carts = [];
    user.cartItemQty = 0;
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user.id),isDeleted:false } },
    ])
    if (!addresses) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: {
        addresses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const makeDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address id is required",
      });
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const userAddresses = await Address.find({ owner: req.user.id });
    if (!userAddresses) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }

    const isUserAddress = userAddresses.some(
      (address) => String(address._id) === String(addressId)
    );

    if (!isUserAddress) {
      return res.status(404).json({
        success: false,
        message: "User address not found",
      });
    }

    if (address.isDefault) {
      return res.status(400).json({
        success: false,
        message: "Address is already default",
      });
    }
    const defaultAddress = await Address.findOne({
      isDefault: true,
      owner: req.user.id,
    });
    if (!defaultAddress) {
      return res.status(404).json({
        success: false,
        message: "Default address not found",
      });
    }
    address.isDefault = true;
    await address.save();
    defaultAddress.isDefault = false;
    await defaultAddress.save();
    return res.status(200).json({
      success: true,
      message: "Address made default",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const dummyOrders = await Order.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user.id) } },
    ])
    console.log(dummyOrders)
    const orders = await Order.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $lookup: {
          from: "items",
          let: { productIds: "$products" },
          pipeline: [
            { $match: { $expr: { $in: ["$_id", "$$productIds.item"] } } },
          ],
          as: "items",
        },
      },
      {
        $addFields: {
          products: {
            $map: {
              input: "$products",
              as: "p",
              in: {
                qty: "$$p.qty",
                item: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$items",
                        as: "i",
                        cond: { $eq: ["$$i._id", "$$p.item"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {$lookup:{
        from:"addresses",
        localField:"address",
        foreignField:"_id",
        as:"shippingAddress"
      }},
      { $addFields: { shippingAddress: { $arrayElemAt: ["$shippingAddress", 0] } } },
      { $project: { items: 0,address:0 } },
    ]);

    if (!orders) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export {
  updateSearchHistory,
  createOrder,
  addToCart,
  rateItem,
  removeItemFromCart,
  clearCart,
  getUsers,
  updateCartItemQty,
  getAddresses,
  makeDefaultAddress,
  getOrders,
};
