import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "E-Commerce UI",
    "url": "https://sheetmob.net",
    "logo": "https://sheetmob.net/logo.webp",
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61578326255422",
    ]
  };

  return (
    <Html>
      <Head>
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />
        <script
          id="mcjs"
          dangerouslySetInnerHTML={{
            __html: `!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/abf9d387dcacfbfd0a8140443/601c2dba1aa78fc411e550cb7.js");`
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />

        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            zIndex: 1000,
          }}
        >
          <div id="tawkto-button-container"></div>

          <a
            href="https://m.me/735809052946502"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              position: 'fixed',
              bottom: '100px',
              right: '20px',
              backgroundColor: '#0084FF',
              color: '#fff',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '24px',
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 1000,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 36 36"
              width="28"
              height="28"
              fill="#fff"
            >
              <path d="M18 0C8.059 0 0 7.44 0 16.608c0 5.22 2.589 9.885 6.663 12.99V36l6.084-3.354a19.776 19.776 0 0 0 5.253.714c9.941 0 18-7.44 18-16.608C36 7.44 27.941 0 18 0Zm3.312 21.672-5.184-5.544-9.12 5.544 10.62-11.16 5.184 5.544 9.12-5.544-10.62 11.16Z" />
            </svg>
          </a>

        </div>

        <script dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function() {
              var s1 = document.createElement("script"),
                  s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/6879ea701786aa1911e6cd9c/1j0e3nidm';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s1.onload = function () {
                var btn = document.querySelector('[iframe], .tawk-custom-color');
                if (btn) {
                  var container = document.getElementById('tawkto-button-container');
                  if (container && btn.parentNode) {
                    container.appendChild(btn.parentNode);
                  }
                }
              };
              s0.parentNode.insertBefore(s1, s0);
            })();
          `
        }} />
      </body>
    </Html>
  )
}
