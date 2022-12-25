const express = require('express')
const controller = express.Router()

const { authorize } = require('../middlewares/authorization')
const productSchema = require('../schemas/productSchema')

// UNSECURED ROUTES
// - Gets all Products
controller.route('/').get(async (req, res) => {
    const productList = []
    const products = await productSchema.find()
    
    if(products) {
        for(let product of products) {
            productList.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(productList)
    } else 
        res.status(400).json()
})

// - Gets Products based on Tag
controller.route('/:tag').get(async (req, res) => {
    const productList = []
    const products = await productSchema.find({ tag: req.params.tag })
    
    if(products) {
        for(let product of products) {
            productList.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(productList)
    } else 
        res.status(400).json()
})

// - Gets Products with Take
controller.route('/:tag/:take').get(async (req, res) => {
    const productList = []
    const products = await productSchema.find({ tag: req.params.tag }).limit(req.params.take)
    
    if(products) {
        for(let product of products) {
            productList.push({
                articleNumber: product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                category: product.category,
                tag: product.tag,
                rating: product.rating,
                imageName: product.imageName
            })
        }
        res.status(200).json(productList)
    } else 
        res.status(400).json()
})

// - Gets Product with Article Number
controller.route('/product/details/:articleNumber').get(async (req, res) => {
    const product = await productSchema.findById(req.params.articleNumber)
    
    if(product) {
        res.status(200).json({
            articleNumber: product._id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            tag: product.tag,
            rating: product.rating,
            imageName: product.imageName
        })
    } else 
        res.status(404).json()
})


// SECURED ROUTES
// - Create Product
controller.route('/').post(authorize, async (req, res) => {
    const { name, description, price, category, tag, imageName, rating } = req.body

    if(!name || !price)
        res.status(400).json({text: "name and price is required."})

    const item_exists = await productSchema.findOne({name})
    if(item_exists)
        res.status(409).json({text: "a product with the same name already exists."})
    else {
        const product = await productSchema.create({
            name, 
            description, 
            price, 
            category,
            tag,
            imageName, 
            rating
        })
        if(product)
            res.status(201).json({text: `product ${product._id} was created succesfully!`})
        else 
            res.status(400).json({text: "something went wrong..."})
    }
})

// - Update Product
controller.route('/:articleNumber').put(authorize, async (req, res) => {
    const udpProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        tag: req.body.tag,
        imageName: req.body.imageName,
        rating: req.body.rating
    }

    let product = await productSchema.findById(req.params.articleNumber)

    if(!udpProduct.name || !udpProduct.price)
        res.status(400).json({ text: "Name and Price is required!" })
    else {
        if(product._id == req.params.articleNumber) {
            res.status(200).json({ text: `Product ${req.params.articleNumber} was updated succesfully!` })
            product = await productSchema.updateOne(product, udpProduct)
        } else 
            res.status(404).json({ text: "This article number does not exist" })
    }
})

// - Delete Product
controller.route('/:articleNumber').delete(authorize, async (req, res) => {
    if(!req.params.articleNumber)
        res.status(400).json({text: "no article number was specified"})
    else {
        const product = await productSchema.findById(req.params.articleNumber)
    
        if(product) {
            await productSchema.remove(product)
            res.status(200).json({text: `product ${req.params.articleNumber} was deleted!`})
        } else {
            res.status(404).json({text: `product ${req.paramws.articleNumber} was not found...`})
        }
    }
})


module.exports = controller