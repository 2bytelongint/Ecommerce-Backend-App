const Product = require('../model/productModel')
const asyncHandler = require("express-async-handler")
const slugify = require("slugify")

const createProduct = asyncHandler(async(req, res) => {
    try {

        if(req.body.title){
            req.body.slug = req.body.title
        }

        const newProduct = await Product.create(req.body)
        res.json(
            newProduct
        )
    } catch (error) {
        throw new Error(error)
    }
})


const getProduct = asyncHandler(async (req,res) => {
    const {id} = req.params
    try {
        const findProducts = await Product.findById(id)
        res.json(findProducts)
    } catch (error) {
        throw new Error(error)
    }
})


const updateProducts = asyncHandler(async(req,res) => {
    const {id} = req.params
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }

        const updateProduct = await Product.findByIdAndUpdate(id, req.body, 
            {
                new : true
            }
        )

        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProducts = asyncHandler(async(req,res) => {
    const {id} = req.params;

    try {
        const deleteProduct = await Product.findByIdAndDelete(id);
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllProducts = asyncHandler(async (req,res) => {
    
    try {
        const queryObj = {...req.query};
        console.log(queryObj)
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el])
        const getAllProducts = await Product.where("category").equals(
            req.query.category
        ) ;
        res.json(getAllProducts)
    } catch (error) {
        throw new Error(error)
    }
})



module.exports = {createProduct, getProduct, updateProducts, deleteProducts, getAllProducts}