import React, { useEffect, useRef, useState } from 'react';
import { Page, Navbar, List, ListInput, BlockTitle, Button, Block, NavLeft, NavTitle, NavRight, Link, Icon, ListItem, Card, CardHeader, CardContent, CardFooter, Badge, f7, Sheet, Toolbar, PageContent } from 'framework7-react';
import { SQLite } from '../utils/sqlite';
import { useLocation } from 'react-router-dom';
import { onRefresh } from './products';
import { calculate } from './sale';
import dayjs from 'dayjs'
import _ from 'lodash'

const ViewAddProducts = () => {

  const { state } = useLocation()

  const [tipo, setTipo] = useState(1)
  const [validade, setValidade] = useState(dayjs().format('YYYY-MM-DD'))
  const [lote, setLote] = useState('')

  const [products, setProducts] = useState([])

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {
    try {

      const db = new SQLite();

      const products = await db.exec(`SELECT produto.codprod, produto.descricao, prodpreco.preco FROM produto LEFT JOIN prodpreco ON prodpreco.codprod = produto.codprod AND prodpreco.numtab = ${state.codtab} ORDER BY produto.descricao`);

      setProducts(products)

    } catch (error) {
      f7.dialog.login(error, 'Ops!')
    }
  }

  const addProduct = (product) => {

    var customDialog = f7.dialog.create({
      title: product.descricao,
      content: `
        <div class="list no-hairlines-md">
          <ul>
            <li class="item-content item-input" style="margin: 0">
              <div class="item-inner">
                <div class="item-title item-label">Valor</div>
                <div class="item-input-wrap">
                  <input type="number" id="input-valor" value="${product.preco}" />
                  <span class="input-clear-button"></span>
                </div>
              </div>
            </li>
            <li class="item-content item-input" style="margin: 0">
              <div class="item-inner">
                <div class="item-title item-label">Quantidade</div>
                <div class="item-input-wrap">
                  <input type="number" placeholder="1" id="input-quantidade" autofocus />
                  <span class="input-clear-button"></span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      `,
      buttons: [
        {
          text: 'Cancelar',
          onClick: function (dialog, e) {
            console.log('Cancelado');
          }
        },
        {
          text: 'OK',
          bold: true,
          onClick: async (dialog, e) => {

            var valor = document.getElementById('input-valor').value;
            var quantidade = document.getElementById('input-quantidade').value;

            const db = new SQLite()

            await db.run(`INSERT INTO pedido2 (numero, tipo, codprod, qtde, pvenda, prtab, dtvalidade, numlote) VALUES (${state.numero}, ${tipo}, ${product.codprod}, ${quantidade || 1}, ${valor}, ${product.preco}, '${validade}', '${lote}')`)

            await calculate(state.numero)

            f7.dialog.alert(`${product.descricao} adicionado com sucesso!`, 'Ok!')

            //window.history.back()

          }
        }
      ]
    });

    customDialog.open();
    
  }

  return (
    <Page>

      <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:arrow_left" iconMd="material:arrow_back" onClick={() => window.history.back()} />
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

        <List strongIos outlineIos dividersIos>

          <ListInput label="Tipo" type="select" value={tipo} onChange={(event) => setTipo(event.target.value)}>
            <option value={1}>Venda</option>
            <option value={2}>Bonificação</option>
            <option value={3}>Troca</option>
            <option value={4}>Outros</option>
          </ListInput>

          <ListInput label="Data de validade" type="date" value={validade} onChange={(event) => setValidade(event.target.value)} />

          <ListInput label="Lote" type="text" value={lote} onChange={(event) => setLote(event.target.value)} />

        </List>

        <BlockTitle>{_.size(products)} produtos(s)</BlockTitle>

        <List dividersIos outlineIos strongIos>
          {_.map(products, (product, index) => (
            <Card key={index} outline headerDivider footerDivider>
              <CardContent style={{ppadding: 0}}>
                <div>{product.codprod} - {product.descricao}</div>
              </CardContent>
              <CardFooter>
                <div>R$ {product.preco}</div>
                <Button onClick={() => addProduct(product)}>Adicionar</Button>
              </CardFooter>
            </Card>
          ))}

        </List>

      </Block>

    </Page>
  );

}

export default ViewAddProducts;