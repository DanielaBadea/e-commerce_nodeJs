const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Products = require('../models/Products');
const auth = require('../middlewares/auth');
const validateCartMidd = require('../middlewares/cart');
const mongoose = require('mongoose');

router.get('/cart', auth, async (req, res) => {
    const userId = req.user._id; 
    try {
        const cart = await Cart.findOne({ userId });

        if (cart) {
            if (cart.items.length > 0) {
                return res.status(200).json(cart);
            } else {
                return res.status(200).json({ message: "Cart is empty", cart });
            }
        } else {
            return res.status(404).json({ message: "Cart not found!" });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve cart' });
    }
});

// router.post('/cart', auth, validateCartMidd, async (req, res) => {
//     const userId = req.user._id;
//     const { items } = req.body;

//     try {
//         let cart = await Cart.findOne({ userId });
//         console.log("Existing cart:", cart);

//         const productId = new mongoose.Types.ObjectId(items[0].productId); 
//         console.log("Looking for product with ID:", productId);

//         const product = await Products.findById(productId);
//         console.log("Product found:", product);

//         if (!product) {
//             return res.status(404).json({ message: "Item not found" });
//         }

//         const quantity = items[0].quantity;

//         if (cart) {
//             const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
//             console.log("Item index in cart:", itemIndex);

//             if (itemIndex >= 0) {
//                 cart.items[itemIndex].quantity += quantity;
//             } else {
//                 cart.items.push({
//                     productId: productId,
//                     title: items[0].title,
//                     brand: items[0].brand,
//                     image: items[0].image,
//                     price: items[0].price,
//                     quantity: quantity
//                 });
//             }

//             cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
//             cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);
//             await cart.save();

//             return res.status(200).json(cart);
//         } else {
//             const newCart = new Cart({
//                 userId,
//                 items: [{
//                     productId: productId,
//                     title: items[0].title,
//                     brand: items[0].brand,
//                     image: items[0].image,
//                     price: items[0].price,
//                     quantity: quantity
//                 }],
//                 totalAmount: items[0].price * quantity,
//                 totalQuantity: quantity
//             });

//             await newCart.save();
//             return res.status(201).json(newCart);
//         }
//     } catch (error) {
//         console.error("Error updating cart:", error);
//         res.status(500).json({ error: 'Failed to update cart' });
//     }
// });


router.delete('/cart/items/:productId', auth, async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params; 

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart!" });
        }

        cart.items.splice(itemIndex, 1);

        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

        await cart.save();

        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ error: 'Failed to delete item from cart' });
    }
});

router.put("/cart/decrement/:productId", auth, async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;
    try {

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found!" });
        }
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId.toString());
        if (itemIndex >= 0 && cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else if (itemIndex >= 0 && cart.items[itemIndex].quantity === 1) {
            cart.items.splice(itemIndex, 1);
        }
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

        await cart.save();

        return res.status(200).json(cart);
    } catch {
        console.error("Error deleting item from cart:", error);
        res.status(500).json({ error: 'Failed to update quanity from cart' });
    }
});

// router.post('/cart', auth,validateCartMidd, async (req, res) => {
//     const userId = req.user._id;
//     const { items } = req.body;

//     try {
//         let cart = await Cart.findOne({ userId });

//         if (!cart) {
//             cart = new Cart({ userId, items: [], totalQuantity: 0, totalAmount: 0 });
//         }

//         for (const item of items) {
//             const productId = new mongoose.Types.ObjectId(item.productId);
//             const product = await Products.findById(productId).select('title brand image price');

//             if (!product) {
//                 return res.status(404).json({ message: "Product not found" });
//             }

//             const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === productId.toString());

//             if (existingItemIndex > -1) {
//                 cart.items[existingItemIndex].quantity += item.quantity;
//             } else {
//                 cart.items.push({
//                     productId,
//                     title: item.title,
//                     brand: item.brand,
//                     image: item.image,
//                     price: item.price,
//                     quantity: item.quantity
//                 });
//             }
//         }

//         cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
//         cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

//         await cart.save();
//         return res.status(200).json(cart);
//     } catch (error) {
//         console.error("Error updating cart:", error);
//         res.status(500).json({ error: 'Failed to update cart' });
//     }
// });

router.post('/cart/:productId', auth, async (req, res) => {
    const userId = req.user._id;
    const productId = req.params.productId;
    const { quantity = 1 } = req.body;
    console.log("User ID:", userId);
    console.log("Product ID:", productId);
    console.log("Quantity:", quantity);

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalQuantity: 0, totalAmount: 0 });
        }

        const product = await Products.findById(productId).select('title brand image price');

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const existingItemIndex = cart.items.findIndex(i => i.productId.toString() === productId.toString());

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId,
                title: product.title,
                brand: product.brand,
                image: product.image,
                price: product.price,
                quantity
            });
        }

        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        cart.totalQuantity = cart.items.reduce((total, item) => total + item.quantity, 0);

        await cart.save();
        return res.status(200).json(cart);
    } catch (error) {
        console.error("Error updating cart:", error);
        res.status(500).json({ error: 'Failed to update cart' });
    }
});




module.exports = router;
