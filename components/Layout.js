import React from 'react';
import { Container } from 'semantic-ui-react';
import Head from 'next/head';
import Header from './Header';

export default props => {
  return (
      <div>
        <style jsx global>
        {`
        body {
          background-image: url("./static/images/trees.png");
        }

        .ui.cards>.card {
          border-style: groove;
          border-radius: 10px;
        }

        .ui.card>.content,
        .ui.cards>.card>.content {
        background-color: #e6e2d3;
        }

        .ui.card>.content.extra,
        .ui.cards>.card>.content.extra {
        background-color: #588c7e;
        }
      `}
      </style>
        <Container>
          <Head>
            <title>
              BlockBrothers
            </title>
          <link
              rel="stylesheet"
              href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
            />
          </Head>

          <Header />
          {props.children}
        </Container>
      </div>
  );
};
