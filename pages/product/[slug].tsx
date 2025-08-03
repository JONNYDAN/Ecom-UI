import { useEffect, useState } from "react";
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
import { fetchProducts, fetchBanners, fetchProductBySlug } from "../../lib/firestoreFetch";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../lib/firebase';
import LoginRegisterModal from "../../components/LoginRegisterModal/LoginRegisterModal";

const ProductDetails = ({ product, products }: any) => {
  const [user] = useAuthState(auth);
  
  // const [products, setProducts] = useState<IProduct[]>([]);
  const { images, name, details, price, description } = product;
  const [index, setIndex] = useState(0);
  const { decreaseQty, increaseQty, qty, onAdd } = useStateContext();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [productsData] = await Promise.all([fetchProducts()]);
  //       setProducts(productsData);
  //       console.log("Products data from Firestore:", productsData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  //     </div>
  //   );
  // }

  const imageUrl = product.images[0];
  return (

    <div>
      <Head>
        <title>{product.name} | E-commerce</title>
        <meta name="description" content={product.description} />
        <meta property="og:title" content={product.name} />
        <meta property="og:description" content={product.description} />
        <meta
          property="og:image"
          content={
            images && images.length > 0
              ? images[0]
              : `${process.env.NEXT_PUBLIC_BASE_URL}/banner_share.jpg`
          }
        />
        <meta property="og:image:width" content="200" />
        <meta property="og:type" content="product" />
        <meta property="fb:app_id" content="1214114103737693" />
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug.current}`} />
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

        <div className="product-detail-desc space-x-3">
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
          <div className="product-description space-y-8  max-w-3xl mx-auto text-gray-800">
            {/* Main Product Description */}
            <section className="mb-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-900">{details}</h2>
              <div className="prose lg:prose-lg">
                <p className="text-lg leading-relaxed mb-4">{description}</p>
                <p className="text-lg leading-relaxed">This premium {name} represents the perfect combination of form and function, designed to deliver exceptional performance while enhancing your space with its elegant aesthetic. Every detail has been carefully considered by our design team to ensure maximum satisfaction.</p>
              </div>
            </section>
          </div>

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
                onClick={() => { }}
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
            details={description}
            image={urlFor(images[0])
              .width(200)
              .url()} // hình nhỏ
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug.current}`}
          />

          <div className="buttons">
            <button
              type="button"
              className="add-to-cart w-[110px] whitespace-nowrap text-[15px] px-3 py-2 mt-[30px] xs:w-[140px] sm:w-[230px] sm:px-4 sm:py-3 sm:text-[20px] md:text-[18px] md:px-2 md:py-2 md:w-[150px] lg:w-[190px]"
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            {!user ? (
              <button
                type="button"
                className="buy-now w-[110px] whitespace-nowrap text-[15px] px-3 py-2 mt-[30px] xs:w-[140px] sm:w-[230px] sm:px-4 sm:py-3 sm:text-[20px] md:text-[18px] md:px-2 md:py-2 md:w-[150px] lg:w-[190px]"
                onClick={() => setIsModalOpen(true)}
              >
                PURCHASE
              </button>
            ):(
              <button
                type="button"
                className="buy-now w-[110px] whitespace-nowrap text-[15px] px-3 py-2 mt-[30px] xs:w-[140px] sm:w-[230px] sm:px-4 sm:py-3 sm:text-[20px] md:text-[18px] md:px-2 md:py-2 md:w-[150px] lg:w-[190px]"
                onClick={() => setShowPaymentModal(true)}
              >
                PURCHASE
              </button>
            )}
          </div>

          <PaymentModal
            open={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
            product={product}  // Single product
            qty={qty}         // Quantity from state
          />

          
        </div>
      </div>
      <div className="pt-5 mx-auto text-gray-800">
        {/* Expanded Features Section */}
        <section className="features bg-gray-50 p-8 rounded-xl mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Detailed Features & Benefits</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold mb-2">Premium Materials</h4>
              <p>Constructed with grade-A materials selected for their durability and aesthetic qualities. Our {name} uses sustainably-sourced components that meet rigorous quality standards.</p>
            </li>
            <li className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold mb-2">Artisan Craftsmanship</h4>
              <p>Each piece is hand-finished by skilled craftsmen with 10+ years experience. The attention to detail ensures perfect seams, flawless finishes, and lasting structural integrity.</p>
            </li>
            <li className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold mb-2">Eco-Conscious Production</h4>
              <p>Our manufacturing process reduces water usage by 40% compared to industry standards and utilizes solar energy. All packaging is 100% recyclable.</p>
            </li>
            <li className="bg-white p-5 rounded-lg shadow-sm">
              <h4 className="text-xl font-semibold mb-2">User-Centered Design</h4>
              <p>Ergonomic testing with real users informs every curve and angle. The result is unparalleled comfort that adapts to your body over time.</p>
            </li>
          </ul>
        </section>

        {/* Comprehensive Care Guide */}
        <section className="care-instructions bg-gray-50 p-8 rounded-xl mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-900">Complete Care & Maintenance Guide</h3>
          <div className="prose lg:prose-lg">
            <p className="mb-6">Proper care will maintain your {name}&rsquo;s beauty and functionality for years to come. Follow these professional recommendations:</p>

            <h4 className="text-xl font-semibold mb-3">Daily Maintenance</h4>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Wipe surfaces with microfiber cloth to remove dust particles that can cause micro-scratches</li>
              <li>Rotate or flip components weekly to ensure even wear patterns</li>
              <li>Check tension points monthly for proper alignment</li>
            </ul>

            <h4 className="text-xl font-semibold mb-3">Seasonal Deep Cleaning</h4>
            <p className="mb-3">Every 3-6 months, perform these thorough cleaning steps:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Use pH-neutral cleaner diluted in warm (not hot) water</li>
              <li>Apply with soft-bristle brush in circular motions</li>
              <li>Rinse with damp cloth and dry immediately</li>
            </ul>

            <h4 className="text-xl font-semibold mb-3">Long-Term Preservation</h4>
            <ul className="list-disc pl-6 space-y-2">
              <li>Apply protective conditioner every 12-18 months</li>
              <li>Store in climate-controlled environment when not in use</li>
              <li>Avoid prolonged exposure to temperature extremes</li>
            </ul>
          </div>
        </section>

        {/* Added Value Sections */}
        <section className="additional-info space-y-8">
          <div className="warranty bg-blue-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Guarantee to You</h3>
            <p className="mb-4">Every {name} comes with our industry-leading 10-year craftsmanship warranty covering:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Structural integrity and frame stability</li>
              <li>Material defects and workmanship issues</li>
              <li>Hardware malfunctions under normal use</li>
            </ul>
            <p>Plus 24/7 customer support and free consultation on proper maintenance.</p>
          </div>

          <div className="brand-story bg-gray-50 p-8 rounded-xl">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">The Story Behind {name}</h3>
            <p className="mb-4">Founded in 2010, our workshop began with three artisans dedicated to reviving traditional techniques. Today, we combine these methods with modern technology while maintaining our commitment to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ethical sourcing of all materials</li>
              <li>Living wages for all craftspeople</li>
              <li>Zero-waste production processes</li>
            </ul>
            <p className="mt-4">When you choose {name}, you&#39;re investing in more than a product - you&#39;re supporting sustainable craftsmanship and helping preserve skills that might otherwise disappear.</p>
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

      <LoginRegisterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

// export const getStaticPaths = async () => {
//   const products = await fetchProducts();
//   const paths = products.map((product: IProduct) => ({
//     params: { slug: product.slug.current },
//   }));

//   return { paths, fallback: 'blocking' };
// };

export const getServerSideProps = async ({ params }: any) => {
  const products = await fetchProducts();
  const product = await fetchProductBySlug(params.slug);

  console.log("Fetched product:", product); // Kiểm tra dữ liệu sản phẩm
  return {
    props: { product, products },
  };
};

export default ProductDetails;
