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
        {/* Schema.org */}
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          strategy="afterInteractive"
        />

        {/* Mailchimp Script */}
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
        {/* Tawk.to Live Chat Widget */}
        <script dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/6879ea701786aa1911e6cd9c/1j0e3nidm';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
            })();
          `
        }} />
        {/* Messenger Chat Plugin */}
        <div id="fb-root"></div>
        <div
          className="fb-customerchat"
          data-attribution="setup_tool"
          data-page_id="61578326255422"
          data-theme_color="#0084ff"
          data-logged_in_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
          data-logged_out_greeting="Xin chào! Chúng tôi có thể giúp gì cho bạn?"
        ></div>
        <Script id="facebook-customerchat" strategy="afterInteractive">
          {`
            window.fbAsyncInit = function() {
              FB.init({
                xfbml: true,
                version: 'v12.0'
              });
            };
            (function(d, s, id) {
              var js, fjs = d.getElementsByTagName(s)[0];
              if (d.getElementById(id)) return;
              js = d.createElement(s); js.id = id;
              js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
              fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
          `}
        </Script>
      </body>
    </Html>
  )
}