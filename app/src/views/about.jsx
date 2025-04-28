import React from 'react';
import { Page, Navbar, Block, BlockTitle, NavLeft, NavTitle, NavRight, Link } from 'framework7-react';

const AboutPage = () => (
  <Page>
    
    {/* Top Navbar */}
    <Navbar sliding={false}>
      <NavLeft>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="left" />
      </NavLeft>
      <NavTitle sliding>About</NavTitle>
      <NavRight>
        <Link iconIos="f7:menu" iconMd="material:menu" panelOpen="right" />
      </NavRight>
    </Navbar>
    
    <BlockTitle>About My App</BlockTitle>
    
    <Block>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni molestiae laudantium
        dignissimos est nobis delectus nemo ea alias voluptatum architecto, amet similique, saepe
        iste consectetur in repellat ut minus quibusdam!
      </p>
      <p>
        Molestias et distinctio porro nesciunt ratione similique, magni doloribus, rerum nobis,
        aliquam quae reiciendis quasi modi. Nam a recusandae, fugiat in ea voluptates fuga eius,
        velit corrupti reprehenderit dignissimos consequatur!
      </p>
      <p>
        Blanditiis, cumque quo adipisci. Molestiae, dolores dolorum quos doloremque ipsa ullam
        eligendi commodi deserunt doloribus inventore magni? Ea mollitia veniam nostrum nihil, iusto
        doloribus a at! Ea molestiae ullam delectus!
      </p>
    </Block>
  </Page>
);

export default AboutPage;
