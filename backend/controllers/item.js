import Item from "../models/item.js";

const getItems = async (req, res) => {
  try {
    console.log("from get items");
    const { page, limit, categoryName,minPrice,maxPrice } = req.query;
    console.log(categoryName)
    if(minPrice && minPrice.trim()!=='undefined' && Number.isNaN(Number(minPrice))){
      return res.status(400).json({
        success: false,
        message: "Min price is not a number",
      });
    }
    if(maxPrice && maxPrice.trim()!=='undefined' && Number.isNaN(Number(maxPrice))){
      return res.status(400).json({
        success: false,
        message: "Max price is not a number",
      });
    }
    const match = {};
    if (categoryName && categoryName.trim()!=='undefined' && categoryName.trim() !== 'All') {
      match.category = categoryName.trim();
    }
    if(minPrice && minPrice.trim()!=='undefined' && maxPrice && maxPrice.trim()!=='undefined'){
      match.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      }
    }
    else if(minPrice && minPrice.trim()!=='undefined'){
      match.price = {
        $gte: Number(minPrice)
      }
    }
    else if(maxPrice && maxPrice.trim()!=='undefined'){
      match.price = {
        $lte: Number(maxPrice)
      }
    }
    console.log('match',match)
    const result = await Item.aggregatePaginate(
      [
        {
          $match: match
        },
      ],
      {
        page: page || 1,
        limit: limit || 10,
        sort: {
          name: 1,
        },
      }
    );
    if (!result.docs) {
      return res.status(500).json({
        success: false,
        message: "Internal server Error",
      });
    }
    const { docs, ...paginateData } = result;
    return res.status(200).json({
      success: true,
      message: "Items fetched successfully",
      data: {
        items: docs,
        paginateData
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { getItems };
