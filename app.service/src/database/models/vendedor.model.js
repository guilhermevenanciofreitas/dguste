import Sequelize from 'sequelize'

export class Vendedor {

  codven = {
    field: 'codven',
    primaryKey: true,
    autoIncrement: true,
    type: Sequelize.BIGINT,
  }

  nome = {
    field: 'nome',
    type: Sequelize.STRING,
  }

  senha = {
    field: 'senha',
    type: Sequelize.STRING,
  }

}