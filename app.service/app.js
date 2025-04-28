import express, { Router } from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from "url"

import { CostumerRoute } from './src/routes/costumer.route.js'

import { SearchRoute } from './src/routes/search.js'
import { ProductRoute } from './src/routes/product.route.js'
import { SaleOrderRoute } from './src/routes/saleOrder.route.js'
import { SellerRoute } from './src/routes/seller.route.js'

export class App {

  express = express()

  constructor() {
    this.initializeMiddlewares()
    this.initializeRoutes()
    this.initializePublic()
  }

  initializeMiddlewares = () => {

    const corsOptions = {
      origin: '*',
      exposedHeaders: ['Last-Acess', 'Expire-In'],
    }

    this.express.use(cors(corsOptions))
    this.express.use(express.json())

  }

  initializeRoutes = () => {

    this.express.use('/api/seller', new SellerRoute().router)
    this.express.use('/api/costumer', new CostumerRoute().router)
    this.express.use('/api/product', new ProductRoute().router)
    this.express.use('/api/sale-order', new SaleOrderRoute().router)

    //Search
    this.express.use('/api/search', new SearchRoute().router)

  }

  initializePublic = () => {

    const __dirname = path.dirname(fileURLToPath(import.meta.url))

    this.express.use(express.static(path.join(__dirname, "public")))

    this.express.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "public", "index.html"))
    })

  }

  listen = (port) => {
    this.express.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  }

}

//tasks()

//taskEmitter.on('taskUpdated', tasks)