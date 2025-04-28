import { Sequelize } from 'sequelize'
import 'dotenv/config'

import { Cliente } from './models/cliente.model.js'
import { Produto } from './models/produto.model.js'
import { ProdutoPreco } from './models/produtoPreco.model.js'
import { Pedido1 } from './models/pedido1.model.js'
import { Vendedor } from './models/vendedor.model.js'

export class AppContext extends Sequelize {
  
  Cliente = this.define('cliente', new Cliente(), { tableName: 'cliente' })
  
  Pedido1 = this.define('pedido1', new Pedido1(), { tableName: 'pedido1' })

  Produto = this.define('produto', new Produto(), { tableName: 'produto' })

  ProdutoPreco = this.define('produtoPreco', new ProdutoPreco(), { tableName: 'prodpreco' })

  Vendedor = this.define('vendedor', new Vendedor(), { tableName: 'vendedor' })
  
  constructor() {

    super({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      dialect: 'mysql',
      timezone: '-03:00',
      dialectOptions: {
        timezone: 'local',
      },
      define: { 
        timestamps: false, 
        freezeTableName: true
      }
    })

  }

}