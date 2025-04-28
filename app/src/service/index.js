//import Swal from 'sweetalert2'
import { f7 } from 'framework7-react';

export class Service {

    Post = async (url, data, headers = {}, isSwal = true) => {

        const env = 'https://vps53636.publiccloud.com.br:1550/api/' //import.meta.env.VITE_API_URL
        const api_url = env + url

        let authorization = JSON.parse(localStorage.getItem('Authorization'))

        try {
            const finalHeaders = {
                'Content-Type': 'application/json',
                ...headers
            }

            if (authorization) {
                finalHeaders['Authorization'] = `${authorization?.token}`
            }

            const response = await fetch(api_url, {
                method: 'POST',
                headers: finalHeaders,
                body: JSON.stringify(data || {})
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw { response: { status: response.status, data: errorData } }
            }

            const responseData = await response.json()

            // Atualizar token se necessário
            if (authorization) {
                authorization.lastAcess = response.headers.get('Last-Acess')
                authorization.expireIn = parseInt(response.headers.get('Expire-In'))
                localStorage.setItem('Authorization', JSON.stringify(authorization))
            }

            return {
                data: responseData,
                headers: {
                    'Last-Acess': response.headers.get('Last-Acess'),
                    'Expire-In': response.headers.get('Expire-In'),
                }
            }

        } catch (error) {

            //API fora do ar
            if (error.code == 'ERR_NETWORK') {
                const message = '[300-1] - Servidor fora do ar!'
                //Swal.fire({showCloseButton: true, title: 'Ops...', icon: 'error', text: message})
                throw new Error(message)
            }

            if (error instanceof TypeError) {
                // Falha de rede
                const message = '[300-2] - Servidor fora do ar!'
                throw new Error(error.message)
            }

            // Outros erros tratados por código
            const status = error?.response?.status

            if (status === 301) {
                const message = '[301] - Servidor em manutenção, aguarde um instante!'
                throw new Error(message)
            }

            if (status === 400) {
                const message = error.response.data.message
                localStorage.removeItem('Authorization')
                const redirect = window.location.pathname === '/' ? '' : `?redirect=${window.location.pathname}`
                window.location.href = `/sign-in${redirect}`
                throw new Error(message)
            }

            if (status === 404) {
                const message = `[404] - Route "${url}"!`
                if (isSwal) {
                    // Swal.fire(...)   // Você pode descomentar e usar o Swal se quiser
                }
                throw new Error(message)
            }

            // Erro desconhecido
            throw new Error('[500] - Ocorreu um erro inesperado!')

        }
    }
}
