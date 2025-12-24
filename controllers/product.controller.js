const productModal = require("../models/product.models");
const cloudinary = require("../configDb/cloud.config");
const addProduct = async (req, res) => {
  try {
    const { name, price, color, ram, emi } = req.body;

    const file = req.files.image;

    if (!name || !price || !color || !ram || !emi || !file) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const exists = await productModal.findOne({ emi });
    if (exists) {
      return res.status(409).json({
        success: false,
        message: "EMI already exists",
      });
    }

    const upload = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "uploads",
    });

    const newProduct = new productModal({
      name,
      price,
      color,
      ram,
      emi,
      image: upload.secure_url,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.log(error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Price must be a number",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { emi, newName, newPrice, newColor, newRam } = req.body;

    const file = req.files.image;

    if (!emi || !newName || !newPrice || !newColor || !newRam || !file) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const findProduct = await productModal.findOneAndUpdate(
      { emi: emi },
      {
        name: newName,
        price: newPrice,
        color: newColor,
        ram: newRam,
        emi,
      }
    );

    if (findProduct) {
      res.status(201).json({
        succes: true,
        message: "Product update successfully!",
        product: findProduct,
      });
    }
    if (!findProduct) {
      res.status(404).json({
        succes: false,
        message: "Product not found!",
      });
    }
  } catch (error) {
    console.log("This is error while updating:", error.message);

    if (error.message.includes("timeout")) {
      res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    res.status(500).json({
      success: false,
      message: "something went wrong while updating product ,please try again",
    });
  }
};

const delProduct = async (req, res) => {
  try {
    const { emi } = req.body;
    if (!emi) {
      res.status(400).json({
        success: false,
        message: "please enter emi",
      });
    }
    const deleteProduct = await productModal.findOne({ emi: emi });
    console.log(deleteProduct);
    const url = deleteProduct.image;
    console.log(url);
    
    const public_id = url.split("/").slice(-2).join("/").split(".")[0];

    await cloudinary.uploader.destroy(public_id);
    const deletedProduct = await productModal.deleteOne({emi})
    if (deletedProduct) {
      res.status(201).json({
        succes: true,
        message: "Product delete successfully!",
        product: deleteProduct,
      });
    }

    if (!delProduct) {
      res.status(404).json({
        succes: false,
        message: "Product not found!",
      });
    }
  } catch (error) {
    console.log("this is error while deleting:", error.message);
    if (error.message.includes("timeout")) {
      res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    res.status(500).json({
      success: false,
      message: "something went wrong while deleting product ,please try again",
    });
  }
};
const readProduct = async (req, res) => {
  try {
    const data = await productModal.find();
    if (!data) {
      res.status(400).json({
        success: false,
        messags: "Data not exists",
      });
    }
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.log("This is error while reading date from db:", error.message);
    if (error.message.includes("timeout")) {
      res.status(500).json({
        success: false,
        message: "Network error, please try again later",
      });
    }
    res.status(500).json({
      success: false,
      message: "something went wrong while reading product ,please try again",
    });
  }
};

module.exports = { addProduct, updateProduct, delProduct, readProduct };
