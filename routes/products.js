const express = require('express');
const router = express.Router();
const Products = require('../models/Products');
const color = require('colors');
const auth = require('../middlewares/auth');

router.get('/',  async (req, res, next) => {
    try {
        const { categoryName, brandName, priceMin = 0, priceMax = Number.MAX_VALUE, sortBy, limit, page } = req.query;

        const applyPagination = limit !== 'all'; 

        let sortOption = {};
        if (sortBy === 'asc') {
            sortOption = { price: 1 };
        } else if (sortBy === 'desc') {
            sortOption = { price: -1 };
        }

        let query = {};

        if (categoryName) {
            query.name = { $regex: new RegExp(`^${categoryName}$`, 'i') };
        }

        if (brandName) {
            query.brand = { $regex: new RegExp(`^${brandName}$`, 'i') };
        }

        query.price = {
            $gte: parseFloat(priceMin),
            $lte: parseFloat(priceMax)
        };

        const total = applyPagination ? await Products.countDocuments(query) : 0;
        const totalPages = applyPagination ? Math.ceil(total / (parseInt(limit, 10) || 12)) : 1;

        const products = applyPagination
            ? await Products.find(query)
                .sort(sortOption)
                .limit(parseInt(limit, 10) || 12)
                .skip((parseInt(page, 10) - 1) * (parseInt(limit, 10) || 12))
            : await Products.find(query).sort(sortOption);

        res.status(200).json({
            products,
            total,
            totalPages,
            currentPage: applyPagination ? parseInt(page, 10) : 1,
        });
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/:productId', async(req, res, next) => {
    try{
        const {productId} = req.params;
        const products = await Products.findById(productId);
        if(products){
            res.status(200).json(products);
        }else{
            console.error('Error fetching product:', err);
        }
    }catch(err){
        next(err)
    }
});

// router.get('/category/:categoryName', async (req, res, next) => {
//     try {
//         const categoryName = req.params.categoryName.toLowerCase();
//         const { priceMin = 0, priceMax = Number.MAX_VALUE , sortBy} = req.query;

//         let sortOption = {};
//         if (sortBy === 'asc') {
//             sortOption = { price: 1 };
//         } else if (sortBy === 'desc') {
//             sortOption = { price: -1 }; 
//         }
//         console.log(`Fetching products for category: ${categoryName} with price range ${priceMin} - ${priceMax}`);
//         const products = await Products.find({
//             name: { $regex: new RegExp('^' + categoryName + '$', 'i') },
//             price: {
//                 $gte: priceMin,
//                 $lte: priceMax
//             }
//         }).sort(sortOption);
//         console.log('Products fetched'.blue);
//         res.status(200).json(products);
//     } catch (err) {
//         console.error('Error fetching products:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.get('/brand/:brandName', async (req, res, next) => {
//     try {
//         const brandName = req.params.brandName.toLowerCase();
//         const products = await Products.find({
//             brand: { $regex: new RegExp(`^${brandName}$`, 'i') }
//         });
//         res.status(200).json(products);
//     } catch (err) {
//         console.error('Error fetching products by brand:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


// router.put('/:productId', async (req, res, next) => {
//     try {
//         const { productId } = req.params;
//         const updateData = req.body;

//         const updatedProduct = await Products.findByIdAndUpdate(
//             productId,
//             updateData,
//             { new: true } // This option returns the updated document
//         );

//         if (updatedProduct) {
//             res.status(200).json(updatedProduct);
//         } else {
//             res.status(404).json({ error: 'Product not found' });
//         }
//     } catch (err) {
//         console.error('Error updating product:', err);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });


module.exports = router;
