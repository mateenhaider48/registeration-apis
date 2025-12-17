const productModal = require("../models/product.models");

const product =async(req,res)=>{

     try {
        const {name, price, color, ram, emi}= req.body;
        const newProduct = new productModal({
            name:name,
            price:price,
            color:color,
            ram:ram,
            emi:emi,
        })

        await newProduct.save();

        res.status(201).json({
            succes:true,
            message:'Product add successfully!',
            product:newProduct
        });

     } catch (error) {
        console.log(error.message);

        res.status(500).json({
            success:false,
            message:'something went wrong while adding product ,please try again'
        })
        
     }
}

const updateProduct = async(req,res)=>{
     
    try {
        const {emi, newName, newPrice, newColor, newRam , newEmi}= req.body;
        const findProduct =await productModal.findOneAndUpdate({emi:emi},{
            name:newName,
            price:newPrice,
            color:newColor,
            ram:newRam,
            emi:newEmi,
        })
        
        if(findProduct){
            res.status(201).json({
                succes:true,
                message:'Product update successfully!',
                product:findProduct
            });
        }
        if(!findProduct){
            res.status(404).json({
            succes:false,
            message:'Product not update try again please!'
        });
        }

    } catch (error) {
        
        console.log(error.message);

        res.status(500).json({
            success:false,
            message:'something went wrong while updating product ,please try again'
        })
    }

}

const delProduct = async(req,res)=>{

    try {
        const {emi} = req.body;
        const deleteProduct = await productModal.findOneAndDelete({emi:emi});

        if(deleteProduct){
            res.status(201).json({
                succes:true,
                message:'Product delete successfully!',
                product:deleteProduct
            });
        }
        
        if(!deleteProduct){
             res.status(404).json({
            succes:false,
            message:'Product not deleted, try again please!'
        });
        }
    } catch (error) {
        
          console.log(error.message);

        res.status(500).json({
            success:false,
            message:'something went wrong while deleting product ,please try again'
        })

    }
}
const readProduct = async(req,res)=>{
    try {
        const data = await productModal.find();
        res.json({data})
    
     }catch (error) {
        
        console.log(error.message);

        res.status(500).json({
            success:false,
            message:'something went wrong while reading product ,please try again'
        })
    }
}

module.exports = {product, updateProduct , delProduct, readProduct} ;