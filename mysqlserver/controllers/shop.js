const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req,res,next) => {  
    //fetch all the products
    Product.fetchAll()
        .then(([rows,fieldsData]) => {
            //render the ejs template
            res.render('shop/product-list',{
                prods:rows,
                pageTitle:'All Products',
                path:'/products',

            }); 
        })
        .catch(err => console.log(err)); 
}

exports.getProduct = (req,res,next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(([product]) => {
               console.log(product);
            res.render('shop/product-detail',{
                product:product[0],
                pageTitle:'your product',
                path:'/products',
            })
        })
        .catch(err => console.log(err));
    
}

exports.getIndex = (req,res,next) => {
    Product.fetchAll()
        .then(([rows,fieldsData]) => {
            //render the ejs template
            res.render('shop/index',{
                prods:rows,
                pageTitle:'Shop',
                path:'/',
    
            }); 
        })
        .catch(err => console.log(err)); 
}


exports.getCart = (req,res,next) => {
    //callback function getCart
    Cart.getCart(cart => {
        //callback fetching all the products
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductsData = cart.products.find(prod => prod.id === product.id);
                if (cartProductsData) {
                     cartProducts.push({productData:product,qty:cartProductsData.qty});
                }
            }
            res.render('shop/cart', {
                path:'/cart',
                pageTitle:'Your Cart',
                products: cartProducts
            });
        });
    });
}

exports.postCart = (req,res,next) => {
    const prodId = req.body.productId;
    //find product by id 
    Product.findById(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    })
    console.log(prodId);
    res.redirect('/cart');
}

exports.posCarttDeleteItem = (req,res,next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => { 
        Cart.deleteProduct(prodId, product.price)
    });
    res.redirect('/cart');
    
}

exports.getOrders = (req,res,next) => {
    res.render('shop/orders', {
        path:'/orders',
        pageTitle:'Your Orders',
        
    })
}

exports.getCheckout = (req,res,next) => {
    res.render('shop/checkout',{
        pageTitle:'checkout',
        path:'/checkout',
    })
}