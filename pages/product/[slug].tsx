import { useEffect, useState } from "react";
import { NextSeo } from 'next-seo';
import { urlFor } from "../../lib/client";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

import Head from "next/head";
import ShareButtons from "../../components/ShareButtons";
import PaymentModal from "../../components/PaymentModal";
import { IProduct } from "../../dto";
import { fetchProducts, fetchBanners } from "../../lib/firestoreFetch";

export default function ProductDetails({ product, openGraphData }: { 
  product: IProduct;
  openGraphData: {
    title: string;
    description: string;
    imageUrl: string;
    url: string;
  }
}) {
  const [products, setProducts] = useState<IProduct[]>([]);

  const { images, name, details, price, description } = product;
  const [index, setIndex] = useState(0);
  const { decreaseQty, increaseQty, qty, onAdd } = useStateContext();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const optimizedImageUrl = `${urlFor(product.images[0])
    .width(200)
    .url()}?auto=format`; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData] = await Promise.all([fetchProducts()]);
        setProducts(productsData);
        console.log("Products data from Firestore:", productsData); // Kiểm tra dữ liệu
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  console.log("OpenGraph Data:", {
    title: `${product.name} | Ecommerce`,
    imageUrl: optimizedImageUrl,
    url: `https://ecom-ui-liart.vercel.app/product/${product.slug.current}`
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <NextSeo
        title={openGraphData.title}
        description={openGraphData.description}
        openGraph={{
          url: openGraphData.url,
          title: openGraphData.title,
          description: openGraphData.description,
          images: [
            {
              url: openGraphData.imageUrl,
              width: 1200,
              height: 630,
              alt: product.name,
            },
          ],
          site_name: 'E-commerce',
        }}
        twitter={{
          cardType: 'summary_large_image',
        }}
      />
      <Head>
        {/* Meta chuẩn */}
        <title>{openGraphData.title}</title>
        <meta name="description" content={openGraphData.description} />

        {/* Open Graph */}
        <meta property="og:title" content={openGraphData.title} />
        <meta property="og:description" content={openGraphData.description} />
        <meta property="og:image" content={openGraphData.imageUrl} />
        <meta property="og:url" content={openGraphData.url} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="Ecommerce" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={openGraphData.title} />
        <meta name="twitter:description" content={openGraphData.description} />
        <meta name="twitter:image" content={openGraphData.imageUrl} />
      </Head>
      <div className="product-detail-container justify-center px-2.5 py-0 xs:p-0 flex-wrap md:flex-nowrap lg:mx-10 lg:justify-start">
        <div>
          <div className="image-container justify-center flex aspect-square w-[250px] h-[250px] xs:w-[310px] xs:h-[310px] sm:w-[500px] sm:h-[500px] md:w-[380px] md:h-[380px] lg:w-[500px] lg:h-[500px]">
            <img
              src={urlFor(images[index]).toString()}
              className="product-detail-image w-full h-full object-cover"
              alt={`${name} - Main product view`} 
            />
          </div>
          <div className="small-images-container justify-center">
            {images?.map((item: any, i: number) => (
              <img
                key={i}
                src={urlFor(item).toString()}
                className={
                  i === index
                    ? "small-image selected-image w-[55px] h-[55px] xs:w-[70px] xs:h-[70px] sm:w-[117px] sm:h-[117px] md:w-[85px] md:h-[85px] lg:w-[115px] lg:h-[115px]"
                    : "small-image w-[55px] h-[55px] xs:w-[70px] xs:h-[70px] sm:w-[117px] sm:h-[117px] md:w-[85px] md:h-[85px] lg:w-[115px] lg:h-[115px]"
                }
                onMouseEnter={() => {
                  setIndex(i);
                }}
                alt={`${name} - View ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc py-0 xs:p-0">
          <h1 className="font-bold text-[22px] xs:text-[27px] sm:text-[43px] md:text-[28px] lg:text-[35px]">
            {name}
          </h1>
          <div className="reviews">
            <div className="flex-row flex text-[20px] xs:text-[24px] sm:text-[30px] md:text-[22px] lg:text-[28px]">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          
          {/* 1. Hero Product Introduction with Expanded Text */}
          <section className="mb-14">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900 leading-tight">
              The {name} - The Pinnacle of [Product Category] Excellence
            </h1>
            <div className="prose lg:prose-xl max-w-none text-gray-700">
              <p className="text-xl leading-relaxed mb-6">
                {description} After three years of intensive research and development, our team of master craftsmen and engineers 
                have created what industry experts are calling the new standard in [product category]. The {name} represents 
                over 200 precision-engineered components working in perfect harmony to deliver an unparalleled user experience.
              </p>
              <p className="text-xl leading-relaxed">
                What truly sets the {name} apart is its remarkable combination of cutting-edge technology and old-world 
                craftsmanship. Each unit undergoes 47 individual quality checks before leaving our solar-powered facility 
                in [location]. The result is a product that looks stunning, feels extraordinary, and performs flawlessly 
                year after year.
              </p>
            </div>
          </section>
          <p className="price text-[26px] xs:text-[28px] sm:text-[30px] md:text-[28px] lg:text-[32px]">
            ${price}
          </p>

          <div className="quantity font-bold">
            <h3 className="text-[18px] xs:text-[20px] sm:text-[26px] md:text-[22px]">
              Quantity
            </h3>
            <p className="quantity-desc flex-row flex m-0">
              <span
                className="minus px-3 self-center sm:px-4 sm:py-3 md:px-3 md:py-2"
                onClick={decreaseQty}
              >
                <AiOutlineMinus className="text-[16px] xs:text-[18px] sm:text-[20px] md:text-[18px]" />
              </span>
              <span
                className="num px-4 py-2 self-center font-normal text-[16px] xs:text-[18px] sm:text-[20px] sm:px-6 sm:py-3 md:text-[18px] md:px-4 md:py-2"
                onClick={() => {}}
              >
                {qty}
              </span>
              <span
                className="plus px-3 self-center sm:px-4 sm:py-3 md:px-3 md:py-2"
                onClick={increaseQty}
              >
                <AiOutlinePlus className="text-[16px] xs:text-[18px] sm:text-[20px] md:text-[18px]" />
              </span>
            </p>
          </div>
          <ShareButtons
            name={name}
            details={details}
            image={urlFor(images[0])
              .width(200)
              .url()} // hình nhỏ
            url={`https://ecom-ui-liart.vercel.app/product/${product.slug.current}`}

          />

          <div className="buttons">
            <button
              type="button"
              className="add-to-cart w-[110px] whitespace-nowrap text-[15px] px-3 py-2 mt-[30px] xs:w-[140px] sm:w-[230px] sm:px-4 sm:py-3 sm:text-[20px] md:text-[18px] md:px-2 md:py-2 md:w-[150px] lg:w-[190px]"
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="buy-now w-[110px] whitespace-nowrap text-[15px] px-3 py-2 mt-[30px] xs:w-[140px] sm:w-[230px] sm:px-4 sm:py-3 sm:text-[20px] md:text-[18px] md:px-2 md:py-2 md:w-[150px] lg:w-[190px]"
              onClick={() => setShowPaymentModal(true)}
            >
              PURCHASE
            </button>
          </div>
          <PaymentModal
            open={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            product={product}
            qty={qty}
          />
        </div>
      </div>
      <div className="product-description space-y-12 max-w-6xl mx-auto px-4 text-gray-800">

        {/* 2. Comprehensive Features with Technical Specifications */}
        <section className="bg-gray-50 p-12 rounded-3xl mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 border-b-2 border-gray-200 pb-6">
            Engineering Marvel: Inside the {name}
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
            {[
              {
                title: "Advanced Material Composition",
                content: [
                  "Primary structure: Aerospace-grade [material] (0.8mm thickness)",
                  "Surface treatment: Proprietary nano-coating (5μm layer) resistant to scratches, UV rays, and fingerprints",
                  "Weight distribution: Computer-optimized balance (42% front / 58% rear) for perfect ergonomics",
                  "Environmental rating: Meets ISO 14001 and RoHS standards for sustainable production"
                ]
              },
              {
                title: "Precision Manufacturing Process",
                content: [
                  "56-step assembly procedure supervised by master craftsmen",
                  "Laser-aligned components accurate to within 0.01mm tolerance",
                  "Hand-finished edges using traditional [technique] method",
                  "72-hour stress testing under simulated 10-year use conditions"
                ]
              },
              {
                title: "User-Centric Design Features",
                content: [
                  "Patented [feature name] system reduces fatigue by up to 62%",
                  "Customizable [component] with 8 adjustable positions",
                  "Integrated [technology] for seamless connectivity",
                  "Ambidextrous operation tested with 500+ users"
                ]
              },
              {
                title: "Sustainable Production",
                content: [
                  "Carbon-negative manufacturing process (removes 3kg CO₂ per unit)",
                  "100% recycled packaging with plant-based inks",
                  "Water usage reduced by 75% compared to industry average",
                  "End-of-life recycling program recovers 98% of materials"
                ]
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-2xl font-semibold mb-5 text-blue-800 flex items-center">
                  <span className="bg-blue-100 text-blue-800 p-3 rounded-full mr-4 w-12 h-12 flex items-center justify-center">
                    {index + 1}
                  </span>
                  {feature.title}
                </h3>
                <ul className="space-y-3">
                  {feature.content.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Ultimate Care Guide with Scientific Approach */}
        <section className="mb-16">
          <div className="prose lg:prose-xl max-w-none">
            <div className="mt-12 bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-lg">
              <h4 className="text-2xl font-semibold mb-4 text-gray-900">Materials Science Insight</h4>
              <p>
                Our research lab discovered that proper maintenance actually improves the {name} performance over time. 
                The [material] undergoes a molecular realignment process when properly conditioned, increasing its 
                tensile strength by up to 12% after 18 months of use. This patented phenomenon is called the 
                [Scientific Name] Effect and is documented in our white paper [link].
              </p>
            </div>
          </div>
        </section>

        {/* 4. Warranty & Legacy Sections */}
        <section className="space-y-14">
          <div className="bg-blue-100 p-12 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-gray-900">
              Our Ironclad 15-Year Warranty Protection
            </h2>
            <div className="grid lg:grid-cols-2 gap-10">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-800">Comprehensive Coverage</h3>
                <ul className="space-y-4">
                  {[
                    "Full protection against material defects (including gradual wear)",
                    "Complete component replacement guarantee",
                    "Free annual tune-ups ($200 value each)",
                    "In-home service available in 50+ countries",
                    "Loaner program during repairs"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-blue-800">Warranty Registration Benefits</h3>
                <ul className="space-y-4">
                  {[
                    "Extended 5-year coverage for registered users",
                    "Exclusive access to master craftsman hotline",
                    "Free digital care course ($150 value)",
                    "Invitations to product improvement workshops",
                    "Early access to next-generation models"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="h-6 w-6 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-lg text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-10 text-lg bg-white p-6 rounded-lg border border-blue-200">
              <strong>Note:</strong> Our warranty is transferable to future owners, maintaining 75% of remaining coverage. 
              Proof of purchase required. Does not cover damage from improper use or unauthorized modifications. 
              Full terms at [link].
            </p>
          </div>
          
          <div className="bg-gray-50 p-12 rounded-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 border-b-2 border-gray-200 pb-6">
              The {name} Heritage: A Legacy of Excellence
            </h2>
            <div className="prose lg:prose-xl max-w-none">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Our Craftsmanship Philosophy</h3>
                  <p className="mb-6">
                    Since our founding in [year] by master [craftsman name], we have adhered to three unwavering principles:
                  </p>
                  <ol className="space-y-6 list-decimal pl-6">
                    <li>
                      <strong>Perfection in Details:</strong> We measure success in millimeters - each {name} contains 
                      17 hidden details invisible to most but essential to quality.
                    </li>
                    <li>
                      <strong>Sustainable Mastery:</strong> Our apprenticeship program trains artisans for 7 years 
                      while planting 100 trees per graduate.
                    </li>
                    <li>
                      <strong>Innovation Through Tradition:</strong> We combine 18th-century [technique] with 
                      AI-assisted precision engineering.
                    </li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Global Impact</h3>
                  <p className="mb-6">
                    Your purchase supports:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "The [Name] Foundation providing vocational training in developing nations",
                      "Our carbon offset program protecting 10 square meters of rainforest per product",
                      "The [University] Materials Science Scholarship Fund",
                      "Local community workshops teaching traditional crafts to at-risk youth"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start">
                        <svg className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-12 bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                <h4 className="text-2xl font-semibold mb-4 text-gray-900">From Our Founder</h4>
                <blockquote className="text-xl italic text-gray-700 pl-6 border-l-4 border-gray-300">
                  The {name} represents my life work - the perfect marriage of form and function. 
                  When you hold one, you are touching the cumulative wisdom of generations of craftsmen, 
                  distilled into a single perfect object. We do not chase trends; we create timeless 
                  pieces that become more valuable with each passing year.
                  <footer className="mt-4 not-italic font-semibold text-gray-900">— [Founder Name], Founder & Master Artisan</footer>
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="maylike-products-wrapper">
        <h2 className="font-bold">You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((item: any) => (
              <Product key={item._id} product={item} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps({ params }: any){
  try {
    const products = await fetchProducts();
    const product = products.find((item: IProduct) => item.slug.current === params.slug);

    if (!product) {
      return { notFound: true };
    }

    // Tạo openGraphData để đảm bảo Facebook hiển thị đúng
    const optimizedImageUrl = urlFor(product.images[0])
      .width(1200)
      .height(630)
      .url();

    return {
      props: { 
        product,
        openGraphData: {
          title: `${product.name} | Ecommerce`,
          description: product.description,
          imageUrl: optimizedImageUrl,
          url: `https://ecom-ui-liart.vercel.app/product/${product.slug.current}`
        }
      }
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
};