import Sequelize from 'sequelize'

export class Produto {

  codprod = {
    field: 'codprod',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  descricao = {
    field: 'descricao',
    type: Sequelize.STRING,
  }

  un = {
    field: 'un',
    type: Sequelize.STRING,
  }

  emb = {
    field: 'emb',
    type: Sequelize.STRING,
  }

  custo = {
    field: 'custo',
    type: Sequelize.DECIMAL,
  }

}