import Address from "../../../models/address.model.js";

const createAddress = async (data) => {
  try {
    const {
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      postalCode,
    } = data;

    if (!userId) {
      throw new Error("User Id requred to save address.");
    }

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !postalCode
    ) {
      throw new Error("Add fields are madatory.");
    }

    const add = await Address.create(data);

    return add;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAllAddress = async (userId) => {
  try {
    if (!userId) {
      throw new Error("Please provide userId");
    }
    const allAdd = await Address.find();
    return allAdd;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export { createAddress, getAllAddress };
