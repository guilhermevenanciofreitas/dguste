import React, { useEffect, useState } from 'react';
import { Page, Navbar, List, ListInput, BlockTitle, Button, Block, NavLeft, NavTitle, NavRight, Link, Icon, ListItem, Card, CardHeader, CardContent, CardFooter, Badge, f7, Subnavbar, Searchbar } from 'framework7-react';
import { SQLite } from '../utils/sqlite';
import { Service } from '../service';
import _ from 'lodash'


export const onRefresh = async () => {
    
  const dialog = f7.dialog.progress('Atualizando...')

  try {

    const costumers = await new Service().Post('costumer/costumers')

    const db = new SQLite()

    await db.run('DELETE FROM cliente')

    for (const costumer of costumers.data.response.rows) {
      await db.run(`INSERT INTO cliente (codcli, razao, fantasia, bairro, cidade, uf, codtab) VALUES (${costumer.codcli}, '${costumer.razao}', '${costumer.fantasia}', '${costumer.bairro}', '${costumer.cidade}', '${costumer.uf}', ${costumer.codtab})`)
    }

    f7.dialog.alert('Atualizado com sucesso!', 'Clientes')

  } catch (error) {

  } finally {
    dialog.close()
  }
  
}

const ViewCostumers = ({isBack, onItem}) => {

  const [costumers, setCostumers] = useState([])

  useEffect(() => {

    const load = async () => {
      try {
        fetchData('')
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    load();    

  }, [])

  
  const fetchData = async (razao) => {
    try {
      
      const db = new SQLite();

      const costumers = await db.exec(`SELECT codcli, razao, fantasia, bairro, cidade, uf, codtab FROM cliente WHERE razao LIKE '%${razao}%' ORDER BY fantasia`);

      setCostumers(costumers)

    } catch (error) {
      f7.dialog.alert(error, 'Ops!')
    }
  }

  return (
    <Page>
      
      <Navbar sliding={false}>
        
        <NavLeft>
          {!onItem && (
            <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
          )}
          {onItem && (
            <Link iconIos="f7:arrow_left" iconMd="material:arrow_back" onClick={() => onItem(undefined)} />
          )}
        </NavLeft>
        <NavTitle sliding>Clientes</NavTitle>
        <NavRight>
          <Link iconIos="f7:refresh" iconMd="material:refresh" onClick={async () => {
            await onRefresh()
            fetchData('')
          }} />
        </NavRight>
      </Navbar>

      <Subnavbar>
        <Searchbar onChange={(event) => fetchData(event.target.value)} placeholder='Procurar' />
      </Subnavbar>

      <Block>

        <BlockTitle>{_.size(costumers)} cliente(s)</BlockTitle>

        <List dividersIos outlineIos strongIos>
          {_.map(costumers, (costumer, index) => (
            <div key={index} onClick={() => onItem(costumer)}>
              <Card outline headerDivider footerDivider>
                <CardContent style={{ppadding: 0}}>
                  <div>{costumer.codcli} - {costumer.razao || costumer.fantasia}</div>
                </CardContent>
                <CardFooter >
                  <div>{costumer.bairro}, {costumer.cidade} - {costumer.uf}</div>
                </CardFooter>
              </Card>
            </div>
          ))}
          
        </List>
    
      </Block>
      
    </Page>
  );

}

export default ViewCostumers;