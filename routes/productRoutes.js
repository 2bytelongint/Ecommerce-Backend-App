const express = require("express");
const { createProduct, getProduct, updateProducts, deleteProducts, getAllProducts } = require("../controller/productCrtl");
const {isAdmin, authMiddleWare} = require("../middleware/authMiddleware")
const router = express.Router();


router.post('/',authMiddleWare,isAdmin,createProduct)
router.get("/:id", getProduct)
router.get("/",getAllProducts)
router.put("/:id/update",authMiddleWare,isAdmin, updateProducts)

router.delete("/:id/delete",authMiddleWare,isAdmin,deleteProducts)
module.exports = router;