import React, { useEffect, useState } from 'react';
import { Page, Navbar, List, ListInput, BlockTitle, Button, Block, NavLeft, NavTitle, NavRight, Link, Icon, ListItem, Card, CardHeader, CardContent, CardFooter, Badge, Fab, FabButtons, FabButton, f7 } from 'framework7-react';
import { useNavigate } from 'react-router-dom';
import { SQLite } from '../utils/sqlite';
import _ from 'lodash';
import { Service } from '../service';

const ViewSales = () => {

  const navigate = useNavigate()

  const [sales, setSales] = useState([])

  useEffect(() => {

    fetchData()

  }, [])

  
  const fetchData = async () => {
    try {
      
      const db = new SQLite();

      const sales = await db.exec('SELECT pedido1.numero, pedido1.finalizado, pedido1.enviado, pedido1.protocolo, pedido1.emissao, cliente.razao, pedido1.pag, pedido1.sit, pedido1.totbruto FROM pedido1 LEFT JOIN cliente ON cliente.codcli = pedido1.codcli ORDER by numero DESC');

      setSales(sales)

    } catch (error) {
      f7.dialog.alert(error, 'Ops!')
    }
  }

  const onNovo = () => {

    navigate('/sale')

  }

  const onOpen = (numero) => {

    navigate('/sale', { state: { numero }})

  }

  const getPagamento = (pag) => {

    switch(pag) {
      case 'N':
        return "Nota Assinada";
      case 'B':
        return "Boleto";
      case 'D':
        return "Dinheiro";
      case 'C':
        return "Cartão";
      case 'T':
        return "Transf. Bancária";
      case 'O':
        return "Outro";
      default:
        return "Nenhum";
    }

  }

  const getSituacao = (sit) => {

    switch(sit) {
      case 'V':
        return "Pronta Entrega";
      case 'P':
        return "Pré-Venda";
      case 'N':
        return "Nota Fiscal";
      case 'R':
        return "Remessa";
      //case 'R':
      //  return "Dev Remessa";
      default:
        return "Nenhum status";
    }

  }

  const enviar = async () => {

    const loading = f7.dialog.progress('Enviando...')

    try {
      
      const db = new SQLite()

      let orders = await db.exec(`SELECT * FROM pedido1 WHERE finalizado = 1 AND enviado = 0`)
  
      for (const item of orders) {
  
        let items = await db.exec(`SELECT * FROM pedido2 WHERE numero = ${item.numero}`)
  
        item.items = items
  
      }
  
      const res = await new Service().Post('sale-order/import', { orders })

      for (const order of res.data.orders) {
  
        await db.run(`UPDATE pedido1 SET enviado = 1, protocolo = ${order.protocolo} WHERE numero = ${order.numero}`)
  
      }
  
      fetchData()
  
    } catch (error) {
      f7.dialog.alert(error.message, 'Ops!')
    } finally {
      loading.close()
    }
    
  }

  return (
    <Page>

      <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>Minhas vendas</NavTitle>
      </Navbar>

      <Block>
        
        <List dividersIos outlineIos strongIos>
        
          <ListInput label="Período" type="date" />

          {_.map(sales, (sale, index) => (
            <div key={index} onClick={() => onOpen(sale.numero)}>
              <Card outline headerDivider footerDivider>
                <CardHeader style={{padding: 10}}>
                  <div style={{fontSize: 16}}>{sale.emissao}</div>
                  <div>
                    {/*<Badge color="orange">Importado</Badge>*/}
                    {sale.finalizado == 0 && sale.enviado == 0 && (
                      <Badge bgColor="green">Aberto</Badge>
                    )}
                    {sale.finalizado == 1 && sale.enviado == 0 && (
                      <Badge bgColor="blue">Finalizado</Badge>
                    )}
                    {sale.finalizado == 1 && sale.enviado == 1 && (
                      <Badge>Enviado nº {sale.protocolo}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent style={{padding: 10}}>
                  <div>#{sale.numero} - {sale.razao}</div>
                </CardContent>
                <CardFooter style={{padding: 10}}>
                  <div>R$ {sale.totbruto} ({getPagamento(sale.pag)}) - {getSituacao(sale.sit)}</div>
                </CardFooter>
              </Card>
            </div>
          ))}
        </List>

      </Block>

      <Fab position="right-bottom" slot="fixed">
        <Icon ios="f7:menu" md="material:menu" />
        <Icon ios="f7:xmark" md="material:close" />
        <FabButtons position="top">
          <FabButton label="Enviar" onClick={enviar}><Icon ios="f7:share" md="material:share" /></FabButton>
          <FabButton label="Novo" onClick={onNovo}><Icon ios="f7:plus" md="material:add" /></FabButton>
        </FabButtons>
      </Fab>

    </Page>
  );

}

export default ViewSales;