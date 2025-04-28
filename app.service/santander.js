import fs from 'fs'
import https from 'https'

const url = 'https://trust-open-h.api.santander.com.br/auth/oauth/v2/token'

// Configuração do certificado `.pem`
const httpsAgent = new https.Agent({
  cert: fs.readFileSync('C:\\Users\\User\\Downloads\\Certificado 2025 Vct 10032026\\certificado.pem') // Certificado PEM
})

// Corpo da requisição (x-www-form-urlencoded)
const params = new URLSearchParams({
  client_id: 'RD4Fw7KxB7u9ISpE099LeVGuRYZGYnty',
  client_secret: 'zwm1iVKFLmAoSasx',
  grant_type: 'client_credentials'
})

async function fetchToken() {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      agent: httpsAgent // Passando o agente HTTPS
    })

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    console.log(result)
  } catch (error) {
    console.error('Erro na requisição:', error)
  }
}

// Executa a requisição
fetchToken()
/*

import fs from 'fs'
import https from 'https'
import qs from 'qs'

const data = qs.stringify({
  'client_id': 'RD4Fw7KxB7u9ISpE099LeVGuRYZGYnty',
  'client_secret': 'zwm1iVKFLmAoSasx',
  'grant_type': 'client_credentials',
  'scope': 'extrato'
})

// Lendo o certificado PFX
const pfxBuffer = fs.readFileSync('C:\\Users\\User\\Downloads\\Certificado 2025 Vct 10032026\\certificado.pfx')

// Criando agente HTTPS
const httpsAgent = new https.Agent({
  pfx: pfxBuffer,
  passphrase: 'Gpd@2025'
})

// Função para fazer a requisição com fetch
async function fetchToken() {
  try {
    const response = await fetch('https://trust-open-h.api.santander.com.br/auth/oauth/v2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: data,
      agent: httpsAgent // Passando o agente HTTPS
    })

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()
    console.log(result)
  } catch (error) {
    console.error('Erro na requisição:', error)
  }
}

// Chamando a função
fetchToken()
*/