import Head from "next/head";
import React from "react";
import { Navbar, Footer } from "../";

interface Props {
  children: React.ReactNode;
}

const Layout = (props: Props) => {
  return (
    <div className="layout">
      <Head>
        <title>E-commerce</title>
        <script type='text/javascript' src='https://platform-api.sharethis.com/js/sharethis.js#property=6878e0f491425d0019d5b2f8&product=sop' async={true}></script>      
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">{props.children}</main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
