import React, { useEffect, useState } from 'react';
import { Page, Navbar, List, ListInput, BlockTitle, Button, Block, NavLeft, NavTitle, NavRight, Link, Icon, ListItem, Card, CardHeader, CardContent, CardFooter, Badge, f7 } from 'framework7-react';
import { SQLite } from '../utils/sqlite';
import { Service } from '../service';
import _ from 'lodash'

export const onRefresh = async () => {

  const dialog = f7.dialog.progress('Atualizando...')

  try {

    const products = await new Service().Post('product/products')

    const db = new SQLite()

    await db.run('DELETE FROM produto')

    for (const product of products.data.products) {
      const query = `INSERT INTO produto (codprod, descricao, un, emb, custo) VALUES (${product.codprod}, '${product.descricao}', '${product.un}', '${product.emb}', ${product.custo})`
      await db.run(query)
    }

    for (const price of products.data.prices) {
      await db.run(`INSERT INTO prodpreco (transacao, numtab, codprod, preco) VALUES (${price.transacao}, ${price.numtab}, ${price.codprod}, ${price.preco})`)
    }

    f7.dialog.alert('Atualizado com sucesso!', 'Produtos')

  } catch (error) {

  } finally {
    dialog.close()
  }
  
}

const ViewProducts = () => {

  const [products, setProducts] = useState([])

  useEffect(() => {

    fetchData()

  }, [])

  
  const fetchData = async () => {
    try {
      
      const db = new SQLite();

      const products = await db.exec('SELECT codprod, descricao FROM produto ORDER BY descricao');

      setProducts(products)

    } catch (error) {
      f7.dialog.alert(error, 'Ops!')
    }
  }

  return (
    <Page>
      
      <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>Produtos</NavTitle>
        <NavRight>
          <Link iconIos="f7:refresh" iconMd="material:refresh" onClick={async () => {
            await onRefresh()
            fetchData()
          }} />
        </NavRight>
      </Navbar>

      <Block>

        <BlockTitle>{_.size(products)} produtos(s)</BlockTitle>

        <List dividersIos outlineIos strongIos>
          {_.map(products, (product) => (
            <Card outline headerDivider footerDivider>
              <CardContent style={{ppadding: 0}}>
                <div>{product.codprod} - {product.descricao}</div>
              </CardContent>
            </Card>
          ))}
          
        </List>
    
      </Block>
      
    </Page>
  );

}

export default ViewProducts;