import { f7, List, ListButton, ListInput, LoginScreenTitle, Page, View } from "framework7-react"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Service } from "../service";
import { SQLite } from "../utils/sqlite";
import _ from 'lodash'


export const onRefresh = async () => {
  try {

    const sellers = await new Service().Post('seller/sellers')

    const db = new SQLite()

    await db.run('DELETE FROM vendedor')

    for (const costumer of sellers.data.sellers) {
      await db.run(`INSERT INTO vendedor (codven, nome, senha) VALUES (${costumer.codven}, '${costumer.nome}', '${costumer.senha}')`)
    }

  } catch (error) {
    console.log(error)
    f7.dialog.alert(error.message, 'Ops!')
  }
}

export const SignIn = () => {

    const navigate = useNavigate()
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        onRefresh()
    }, [])

    const signIn = async () => {

        if (username.toString() == '') {
            f7.dialog.alert('Informe o usuário!', 'Ops!')
            return
        }

        if (password.toString() == '') {
            f7.dialog.alert('Informe a senha!', 'Ops!')
            return
        }

        const db = new SQLite()

        const user = await db.exec(`SELECT * FROM vendedor WHERE nome = '${username.toUpperCase()}'`)

        if (_.size(user) == 0) {
            f7.dialog.alert('Usuário não encontrado!', 'Ops!')
            return
        }

        if (user[0].senha != password) {
            f7.dialog.alert('Senha incorreta!', 'Ops!')
            setPassword('')
            return
        }

        localStorage.setItem('codven', user[0].codven)

        navigate('/sales')
        
    }

    return (
        <View>
            <Page loginScreen>
                
                <LoginScreenTitle>Login</LoginScreenTitle>

                <List form>
                    <ListInput type="text" label="Usuário" autocomplete="off" value={username} onInput={(e) => setUsername(e.target.value)} autofocus />
                    <ListInput type="password" label="Senha" autocomplete="off" value={password} onInput={(e) => setPassword(e.target.value)} />
                </List>
                
                <List>
                    <ListButton title="Entrar" onClick={signIn} />
                </List>

            </Page>
        </View>
    )

}