import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import { getDevice } from 'framework7/lite-bundle';
import {
  f7,
  f7ready,
  App,
  Panel,
  View,
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
} from 'framework7-react';
import capacitorApp from './capacitor-app';

import { StatusBar, Style } from '@capacitor/status-bar';

document.addEventListener('deviceready', () => {
  StatusBar.setOverlaysWebView({ overlay: false });
  StatusBar.setStyle({ style: Style.Light });
});

// Import your page components
import { SignIn } from './views/sign-in';
import ViewSales from './views/sales';
import ViewSale from './views/sale';
import ViewCostumers from './views/costumers';
import ViewProducts from './views/products';
import ViewAddProducts from './views/add-products';

const MainLayout = ({children}) => {
  
  const navigate = useNavigate()

  return (
    <>

      {/* Left Panel */}
      <Panel left cover dark visibleBreakpoint={960} swipe>
        <View>
          <Page>
            <Navbar title="Menu" />
            <List>
              <ListItem panelClose link="/sales" title="Minhas vendas" onClick={() => navigate('/sales')} />
              <ListItem panelClose link="/costumers" title="Clientes" onClick={() => navigate('/costumers')} />
              <ListItem panelClose link="/products" title="Produtos" onClick={() => navigate('/products')} />
              <ListItem panelClose link="/loggout" title="Sair" onClick={async () => {
                localStorage.removeItem('codven')
                await navigate('/sign-in')
              }} />
            </List>
          </Page>
        </View>
      </Panel>

      {/* Right Panel */}
      <Panel right reveal dark>
        <View>
          <Page>
            <Navbar title="Right Panel" />
            <Block>Right panel content goes here</Block>
          </Page>
        </View>
      </Panel>

      {/* Main View with React Router Routes */}
      <View main className="safe-areas">
        {children}
      </View>

    </>
  )

}


export const checkAuthorization = () => {

  if (!localStorage.getItem("codven")) {
    return false
  }

  return true

  const authData = localStorage.getItem("Authorization")

  if (!authData) {
    return false
  }

  const { token, lastAcess, expireIn } = JSON.parse(authData);

  if (!token || !lastAcess || !expireIn) {
    return false
  }

  const expirationTime = Number(lastAcess) + Number(expireIn) * 60 * 1000

  if (Date.now() >= expirationTime) {
    return false
  } else {
    return true
  }

}

const LoginRequired = ({ children }) => {

  const [isAuthenticated, setIsAuthenticated] = useState(null)

  useEffect(() => {

    let animationFrameId

    const checkAuth = () => {

      const isAuth = checkAuthorization()

      if (!isAuth) {
        setIsAuthenticated(false)
      } else {
        setIsAuthenticated(true)
        animationFrameId = requestAnimationFrame(checkAuth)
      }
    }

    checkAuth()

    return () => cancelAnimationFrame(animationFrameId)

  }, [])

  if (isAuthenticated === null) {
    return null
  }

  const redirect = window.location.pathname == '/' ? '' : `?redirect=${window.location.pathname}`

  return isAuthenticated ? children : <Navigate to={`/sign-in${redirect}`} replace />

}

const MyApp = () => {
  
  const device = getDevice();

  const f7params = {
    name: 'Vendas',
    theme: 'auto',
    serviceWorker: process.env.NODE_ENV === 'production' ? { path: '/service-worker.js' } : {},
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    statusbar: {
      enabled: true,
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
  }

  f7ready(() => {
    if (f7.device.capacitor) {
      capacitorApp.init(f7);
    }
  })

  return (
    <BrowserRouter>
      <App {...f7params}>

        <Routes>
          <Route path="/sign-in" element={<SignIn />} />

          <Route path="/costumers" element={<LoginRequired><MainLayout><ViewCostumers /></MainLayout></LoginRequired>} />
          <Route path="/products" element={<LoginRequired><MainLayout><ViewProducts /></MainLayout></LoginRequired>} />

          <Route path="/" element={<LoginRequired><MainLayout><ViewSales /></MainLayout></LoginRequired>} />
          <Route path="/sales" element={<LoginRequired><MainLayout><ViewSales /></MainLayout></LoginRequired>} />
          <Route path="/sale" element={<LoginRequired><MainLayout><ViewSale /></MainLayout></LoginRequired>} />
          
          <Route path="/add-products" element={<LoginRequired><MainLayout><ViewAddProducts /></MainLayout></LoginRequired>} />

        </Routes>

      </App>
    </BrowserRouter>
  );
};

export default MyApp;
