import Address from "../models/address.js";

export const createAddress = async (req, res) => {
  try {
    const { name, state, city, street } = req.body;

    if (!name || !state || !city || !street) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userAddresses = await Address.find({ owner: req.user.id });

    const isDefaultAddress = !userAddresses.length > 0;

    const address = await Address.create({
      name,
      state,
      city,
      street,
      isDefault: isDefaultAddress,
      owner: req.user.id,
    });

    return res.status(201).json(address);
  } catch (error) {
    return res.status(500).json({ message: "Error creating address" });
  }
};

export const deleteAdress = async (req, res) => {
  try {
    const { addressId } = req.params;
    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "addressId is required",
      });
    }
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    address.isDeleted = true;
    await address.save();
    if (address.isDefault) {
      const defaultAddress = await Address.findOne({ owner: req.user.id });
      if (defaultAddress) {
        await defaultAddress.updateOne({ isDefault: true });
      }
    }
    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
