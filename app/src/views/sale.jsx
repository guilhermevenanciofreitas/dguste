import React, { useEffect, useState } from 'react';
import { Page, Navbar, List, ListInput, BlockTitle, Button, Block, NavLeft, NavTitle, NavRight, Link, Icon, ListItem, Card, CardHeader, CardContent, CardFooter, Badge, Toolbar, f7 } from 'framework7-react';
import { SQLite } from '../utils/sqlite';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import _ from 'lodash'
import ViewCostumers from './costumers';

export const calculate = async (numero) => {
    
  const db = new SQLite()

  const pedido = await db.exec(`SELECT tipo, pvenda, qtde FROM pedido2 WHERE numero = ${numero}`)

  var TOTBRUTO = 0;
  var TOTBONIF = 0;
  var TOTTROCA = 0;
  var TOTOUTROS = 0;

  for(const item of pedido){
      
    switch (item.tipo){
      case 1:
        TOTBRUTO += parseFloat(item.pvenda) * parseFloat(item.qtde);
        break;
      case 2:
        TOTBONIF += parseFloat(item.pvenda) * parseFloat(item.qtde);
        break;
      case 3:
        TOTTROCA += parseFloat(item.pvenda) * parseFloat(item.qtde);
        break;
      case 4:
        TOTOUTROS += parseFloat(item.pvenda) * parseFloat(item.qtde);
        break
    }

  }

  await db.run(`UPDATE pedido1 SET totbruto = ${TOTBRUTO}, totbonif = ${TOTBONIF}, tottroca = ${TOTTROCA}, totoutros = ${TOTOUTROS} WHERE numero = ${numero}`)

}

const ViewSale = () => {

  const navigate = useNavigate()
  const { state } = useLocation()

  const [tab, setTab] = useState('Principal')

  const [searchCostumer, setSearchCostumer] = useState(false)

  const [finalizado, setFinalizado] = useState('')
  const [enviado, setEnviado] = useState('')

  const [numero, setNumero] = useState('')
  const [protocolo, setProtocolo] = useState('')
  const [emissao, setEmissao] = useState('')
  const [codcli, setCodCli] = useState('')
  const [razao, setRazao] = useState('')
  const [pag, setPag] = useState('')
  const [sit, setSit] = useState('')
  const [prz, setPrz] = useState('')
  const [obs, setObs] = useState('')

  const [totbruto, setTotbruto] = useState('')

  const [saleProducts, setSaleProducts] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      
      if (state?.numero) {

        const db = new SQLite();

        const sale = await db.exec(`SELECT pedido1.numero, pedido1.finalizado, pedido1.enviado, pedido1.protocolo, pedido1.emissao, pedido1.codcli, cliente.razao, cliente.fantasia, pedido1.pag, pedido1.sit, pedido1.prz, pedido1.obs, pedido1.totbruto FROM pedido1 LEFT JOIN cliente ON cliente.codcli = pedido1.codcli WHERE pedido1.numero = ${state.numero}`);
  
        const saleProducts = await db.exec(`SELECT pedido2.id, pedido2.numero, pedido2.qtde, produto.descricao, produto.un, pedido2.pvenda FROM pedido2 LEFT JOIN produto ON produto.codprod = pedido2.codprod WHERE pedido2.numero = ${state.numero}`)

        setSaleProducts(saleProducts)

        setEmissao(sale[0].emissao)

        setNumero(sale[0].numero)
        setProtocolo(sale[0].protocolo)
        setEmissao(sale[0].emissao)

        setCodCli(sale[0].codcli)
        setRazao(sale[0].razao || sale[0].fantasia)

        setPag(sale[0].pag)
        setSit(sale[0].sit)
        setPrz(sale[0].prz)
        setObs(sale[0].obs)

        setFinalizado(sale[0].finalizado)
        setEnviado(sale[0].enviado)
        
        setTotbruto(sale[0].totbruto)
  
      }
      
    } catch (error) {
      f7.dialog.alert(error, 'Ops!')
    }
  }

  const onSalvar = async () => {

    await salvar()

    f7.dialog.alert('Salvo com sucesso!', 'Venda', () => navigate('/sales'))

  }

  const onFinalizar = async () => {

    await finalizar()

    f7.dialog.alert('Finalizado com sucesso!', 'Venda', () => navigate('/sales'))

  }

  const onCancelar = async () => {

    await cancelar()

    f7.dialog.alert('Cancelado com sucesso!', 'Venda', () => navigate('/sales'))

  }

  const salvar = async () => {

    const db = new SQLite()

    const codven = localStorage.getItem('codven')

    if (numero == '') {
      await db.run(`INSERT INTO pedido1 (codven, codcli, pag, sit, prz, obs) VALUES (${codven}, ${codcli}, '${pag}', '${sit}', '${prz}', '${obs}')`)
    } else {
      await db.run(`UPDATE pedido1 SET codcli = ${codcli}, pag = '${pag}', sit = '${sit}', prz = '${prz}', obs = '${obs}' WHERE numero = ${numero}`)
    }

  }

  const finalizar = async () => {

    const db = new SQLite()

    await db.run(`UPDATE pedido1 SET finalizado = 1 WHERE numero = ${numero}`)

  }

  const cancelar = async () => {

    const db = new SQLite()

    await db.run(`UPDATE pedido1 SET finalizado = 0 WHERE numero = ${numero}`)

  }

  const onAddProduct = async () => {

    if (codcli == '') {
      f7.dialog.alert('Informe o cliente!', 'Atenção', () => {
        setTab("Principal")
      })
      return
    }

    await salvar()

    const db = new SQLite()

    const cliente = await db.exec(`SELECT codtab FROM cliente WHERE codcli = ${codcli}`)

    navigate('/add-products', { state: { numero: state.numero, codtab: cliente[0].codtab } })

  }

  const onDeleteProduct = (numero, id) => {

    f7.dialog.confirm('Tem certeza que deseja excluir ?', 'Confirmar', async () => {

      const db = new SQLite()

      await db.run(`DELETE FROM pedido2 WHERE id = ${id}`)

      await calculate(numero)
  
      fetchData()
  
    })

  }

  if (searchCostumer) {
    return <ViewCostumers onItem={(costumer) => {

      if (costumer) {
        setCodCli(costumer.codcli)
        setRazao(costumer.razao || costumer.fantasia)
      }

      setSearchCostumer(false)

    }} />
  }

  return (
    <Page>
      
      <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>Venda</NavTitle>
      </Navbar>

      <Toolbar top tabbar>
        <Link tabLink="#Principal" tabLinkActive={tab == 'Principal'} onClick={() => setTab('Principal')}>Principal</Link>
        <Link tabLink="#Produtos" tabLinkActive={tab == 'Produtos'} onClick={() => setTab('Produtos')}>Produtos</Link>
      </Toolbar>

      <Block>

        {tab == 'Principal' && (


          <List strongIos outlineIos dividersIos>

            <Block>
              <div className="grid grid-cols-2 grid-gap">
                {finalizado == 0 && enviado == 0 && (
                  <>
                    <Button tonal onClick={onSalvar}>Salvar</Button>
                    <Button tonal bgColor='green' onClick={onFinalizar}>Finalizar</Button>
                  </>
                )}
                {finalizado == 1 && enviado == 0 && (
                  <>
                    <Button tonal bgColor='red' color='white' onClick={onCancelar}>Cancelar</Button>
                    <Button tonal bgColor='blue' color='white' onClick={onFinalizar}>Enviar</Button>
                  </>
                )}
              </div>
              
              <div className="grid grid-cols-1 grid-gap">
                {enviado == 1 && (
                  <>
                    <Button tonal bgColor='blue' color='white' disabled>Enviado nº {protocolo}</Button>
                  </>
                )}
              </div>
            </Block>

            <ListInput label="Número" type="text" value={numero} readonly />
            <ListInput label="Data" type="date" value={dayjs(emissao).format('YYYY-MM-DD')} />
            <ListInput label="Cliente" type="text" value={codcli ? `${codcli} - ${razao}` : ''} onFocus={() => setSearchCostumer(true)} />
            <ListInput label="Forma de pagamento" type="select" value={pag} onChange={(event) => setPag(event.target.value)}>
              <option value=''>[Selecione]</option>
              <option value="N">Nota Assinada</option>
              <option value="B">Boleto</option>
              <option value="D">Dinheiro</option>
              <option value="C">Cartão</option>
              <option value="T">Transf. Bancária</option>
              <option value="O">Outro</option>
            </ListInput>
            <ListInput label="Status" type="select" value={sit} onChange={(event) => setSit(event.target.value)}>
              <option value=''>[Selecione]</option>
              <option value="V">Pronta Entrega</option>
              <option value="P">Pré-Venda</option>
              <option value="N">Nota Fiscal</option>
              <option value="N">Devolução</option>
              <option value="R">Remessa</option>
              <option value="D">Dev Remessa</option>
            </ListInput>
            <ListInput label="Prazo" type="text" value={prz} onChange={(event) => setPrz(event.target.value)} />
            <ListInput label="Observação" type="textarea" resizable value={obs} onChange={(event) => setObs(event.target.value)} />
          </List>
        )}

        {tab == 'Produtos' && (
          <List strongIos outlineIos dividersIos>

            <Block strongIos outlineIos className="grid grid-cols-1">

              <Button fill onClick={onAddProduct}>Adicionar produto</Button>

              <div className="grid grid-cols-4 grid-gap" style={{padding: 10}}>
                <div><b>Bruto:</b><br></br>{totbruto}</div>
                <div><b>Bonif.:</b><br></br>0</div>
                <div><b>Troca:</b><br></br>0</div>
                <div><b>Outros:</b><br></br>0</div>
              </div>

              <hr></hr>

              {_.size(saleProducts) == 0 && (<div style={{padding: 10}}>Nenhum produto adicionado!</div>)}
              
            </Block>


            {_.map(saleProducts, (saleProduct, index) => (
              <div key={index}>
                <Card outline headerDivider footerDivider>
                  <CardHeader style={{padding: 10}}>
                    <div style={{fontSize: 16}}>{saleProduct.qtde} X {saleProduct.descricao}</div>
                    <div><Badge color="gray">Venda</Badge></div>
                  </CardHeader>
                  <CardContent style={{padding: 10}}>
                    <div>R$ {saleProduct.pvenda} - <b>Total:</b> R$ {parseFloat(saleProduct.qtde || 0) * parseFloat(saleProduct.pvenda || 0)}</div>
                  </CardContent>
                  <CardFooter style={{padding: 10}}>
                    <div></div><div style={{display: 'flex', gap: 5}}><Button fill small bgColor='orange'>Editar</Button><Button fill small bgColor='red' onClick={() => onDeleteProduct(saleProduct.numero, saleProduct.id)}>Excluir</Button></div>
                  </CardFooter>
                </Card>
              </div>
            ))}

          </List>
        )}

      </Block>
      
    </Page>
  );

}

export default ViewSale;