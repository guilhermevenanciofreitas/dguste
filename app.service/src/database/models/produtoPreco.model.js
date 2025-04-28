import Sequelize from 'sequelize'

export class ProdutoPreco {

  transacao = {
    field: 'transacao',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  numtab = {
    field: 'numtab',
    type: Sequelize.INTEGER,
  }

  codprod = {
    field: 'codprod',
    type: Sequelize.INTEGER,
  }

  preco = {
    field: 'preco',
    type: Sequelize.DECIMAL,
  }

}