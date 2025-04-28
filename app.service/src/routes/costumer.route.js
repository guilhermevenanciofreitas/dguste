import { Router } from 'express'
import { CostumerController } from '../controllers/costumer.controller.js'

export class CostumerRoute {

    router = Router()
    controller = new CostumerController()

    constructor() {
        this.intializeRoutes()
    }

    intializeRoutes() {
        this.router.post('/costumers', async (req, res) => await this.controller.costumers(req, res))
    }

}