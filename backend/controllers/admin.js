import Category from "../models/category.js";
import uploadFiles from "../utils/cloudinary.js";
import Item from "../models/item.js";
import mongoose from "mongoose";
import User from "../models/user.js";
import Order from "../models/order.js";

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const category = await Category.findOne({ name: name });
    if (category) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({ name, description });
    if (newCategory) {
      await newCategory.save();
      return res.status(201).json({
        success: true,
        message: "Category created successfully",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (!categories) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: {
        categories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const category = await Category.findById(
      new mongoose.Types.ObjectId(catId)
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      new mongoose.Types.ObjectId(catId),
      {
        name,
        description,
      },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(500).json({
        success: false,
        message: "Category update failed",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: {
        updatedCategory,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const addItem = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;

    if ([name, price, description, stock, category].includes(undefined)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    console.log(category);

    const existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category not found",
      });
    }
    console.log(req.files);
    const featuredImgs = [];
    for (const file of req.files) {
      const url = await uploadFiles(file.path);
      featuredImgs.push(url);
    }
    console.log("featured images", featuredImgs);
    const item = new Item({
      name,
      price,
      description,
      stock,
      category,
      featuredImgs,
    });

    if (item) {
      await item.save();
      return res.status(201).json({
        success: true,
        message: "Item added successfully",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Item creation failed",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.query;

    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: "Item ID is required",
      });
    }

    const users = await User.find();
    for (const user of users) {
      for (const cartItem of user.carts) {
        if (String(cartItem.itemId) === String(itemId)) {
          user.carts.splice(user.carts.indexOf(cartItem), 1);
          user.cartItemQty -= cartItem.qty;
          await user.save();
        }
      }
    }

    console.log(itemId);

    await Item.findByIdAndDelete(new mongoose.Types.ObjectId(itemId));
    return res.status(200).json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const updateItem = async (req, res) => {
  try {
    console.log("=== REQUEST BODY ===");
    console.log("req.body:", req.body);
    console.log("req.files:", req.files);

    const { itemId, name, price, description, stock, category } = req.body;
    const existingItem = await Item.findById(itemId);

    if (!existingItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // Handle existing images (sent as JSON string)
    let existingImages = [];
    if (req.body.existingFeaturedImgs) {
      try {
        existingImages = JSON.parse(req.body.existingFeaturedImgs);
      } catch (e) {
        console.error("Error parsing existing images:", e);
      }
    }

    // Handle new file uploads
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadFiles(file.path);
        newImageUrls.push(url);
      }
    }

    // Combine existing and new images
    const allImages = [...existingImages, ...newImageUrls];

    // Update the item
    const updatedItem = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        price,
        description,
        stock,
        category,
        featuredImgs: allImages,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: { updatedItem },
    });
  } catch (error) {
    console.error("Update item error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { catId } = req.params;
    const category = await Category.findById(
      new mongoose.Types.ObjectId(catId)
    );
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndDelete(new mongoose.Types.ObjectId(catId));

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getDashBoardData = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({});
    const allRevenue = await Order.aggregate([
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
      {
        $addFields: {
          revenue: {
            $sum: {
              $map: {
                input: "$products",
                as: "p",
                in: {
                  $multiply: ["$$p.qty", "$$p.item.price"],
                },
              },
            },
          },
        },
      },
    ]);
    const generatedRevenue = await Order.aggregate([
      { $match: { status: { $ne: "pending" } } },
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
      {
        $addFields: {
          revenue: {
            $sum: {
              $map: {
                input: "$products",
                as: "p",
                in: {
                  $multiply: ["$$p.qty", "$$p.item.price"],
                },
              },
            },
          },
        },
      },
    ]);
    const ordersByMonth = (
      await Order.aggregate([
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ])
    ).filter((order) => order._id.year === new Date().getFullYear());
    console.log(ordersByMonth);
    const orderTrend = [
      { month: "January", orders: 0 },
      { month: "February", orders: 0 },
      { month: "March", orders: 0 },
      { month: "April", orders: 0 },
      { month: "May", orders: 0 },
      { month: "June", orders: 0 },
      { month: "July", orders: 0 },
      { month: "August", orders: 0 },
      { month: "September", orders: 0 },
      { month: "October", orders: 0 },
      { month: "November", orders: 0 },
      { month: "December", orders: 0 },
    ].map((item, index) => {
      if (ordersByMonth.some((order) => order._id.month === index + 1)) {
        return {
          ...item,
          orders: ordersByMonth.find((order) => order._id.month === index + 1)
            .totalOrders,
        };
      }
      return item;
    });
    const totalRevenue = generatedRevenue.reduce(
      (acc, item) => acc + item.revenue,
      0
    );
    const recentOrders = await Order.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "customer",
          pipeline: [{ $project: { userName: 1 } }],
        },
      },

      {
        $lookup: {
          from: "items",
          localField: "products.item",
          foreignField: "_id",
          as: "items",
          pipeline: [
            {
              $project: {
                name: 1,
                price: 1,
                stock: 1,
                category: 1,
              },
            },
          ],
        },
      },

      // flatten customer
      {
        $set: {
          customer: { $arrayElemAt: ["$customer", 0] },
        },
      },

      // rebuild products array correctly
      {
        $set: {
          products: {
            $map: {
              input: "$products",
              as: "p",
              in: {
                quantity: "$$p.qty",
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

      // optional cleanup
      {
        $unset: "items",
      },

      { $sort: { createdAt: -1 } },
      { $limit: 5 },
    ]);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: {
        totalOrders,
        totalUsers,
        totalRevenue,
        avgOrderValue: allRevenue.reduce((acc, item) => acc + item.revenue, 0) /
          totalOrders,
        orderTrend,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const { page } = req.query;
    const result = await Order.aggregatePaginate(
      [
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "customer",
            pipeline: [{ $project: { userName: 1 } }],
          },
        },

        {
          $lookup: {
            from: "items",
            localField: "products.item",
            foreignField: "_id",
            as: "items",
            pipeline: [
              {
                $project: {
                  name: 1,
                  price: 1,
                  stock: 1,
                  category: 1,
                },
              },
            ],
          },
        },

        // flatten customer
        {
          $set: {
            customer: { $arrayElemAt: ["$customer", 0] },
          },
        },

        // rebuild products array correctly
        {
          $set: {
            products: {
              $map: {
                input: "$products",
                as: "p",
                in: {
                  quantity: "$$p.qty",
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

        // optional cleanup
        {
          $unset: "items",
        },
      ],
      {
        page: page || 1,
        limit: 10,
        sort: { createdAt: -1 },
      }
    );
    const { docs: orders, ...paginateData } = result;
    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: {
        orders,
        paginateData,
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
    const { orderId } = req.params;
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order id is required",
      });
    }
    const result = await Order.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(orderId) } },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "customer",
          pipeline: [{ $project: { userName: 1 } }],
        },
      },

      {
        $lookup: {
          from: "items",
          localField: "products.item",
          foreignField: "_id",
          as: "items",
          pipeline: [
            {
              $project: {
                name: 1,
                price: 1,
                stock: 1,
                category: 1,
              },
            },
          ],
        },
      },

      // flatten customer
      {
        $set: {
          customer: { $arrayElemAt: ["$customer", 0] },
        },
      },

      // rebuild products array correctly
      {
        $set: {
          products: {
            $map: {
              input: "$products",
              as: "p",
              in: {
                quantity: "$$p.qty",
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

      {
        $lookup: {
          from: "addresses",
          localField: "address",
          foreignField: "_id",
          as: "address",
        },
      },

      { $addFields: { address: { $arrayElemAt: ["$address", 0] } } },

      { $unset: "items" },
    ]);
    console.log("result", result);
    return res.status(200).json({
      success: true,
      message: "Order found successfully",
      data: {
        order: result[0],
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
  addCategory,
  getCategories,
  addItem,
  deleteItem,
  updateItem,
  updateCategory,
  deleteCategory,
  getDashBoardData,
  getOrders,
  getOrder,
};
