import React, { useEffect } from 'react';
import { Page, Navbar, BlockTitle, Block, NavLeft, NavTitle, Link } from 'framework7-react';
import QRCode from "react-qr-code";

const ViewQRCode = () => {

  useEffect(() => {
    
  }, [])

  return (
    <Page>
      
      {/* Top Navbar */}
      <Navbar sliding={false}>
        <NavLeft>
          <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
        </NavLeft>
        <NavTitle sliding>QRCode</NavTitle>
      </Navbar>

      <Block>

        <QRCode value="12h3i12h31had87891hb1bjhbacjhbihirwuoejiheqhkjax" size={500} style={{width: '100%'}} />
        
      </Block>
      
    </Page>
  );

}

export default ViewQRCode;