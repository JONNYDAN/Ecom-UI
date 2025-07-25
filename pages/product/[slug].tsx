import { useEffect, useState } from "react";
import { client, urlFor } from "../../lib/client";
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

const ProductDetails = ({ product }: any) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decreaseQty, increaseQty, qty, onAdd } = useStateContext();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta property="og:title" content={name} />
        <meta property="og:description" content={details} />
        <meta
          property="og:image"
          content={urlFor(image && image[0])
            .width(200)
            .url()}
        />
        <meta
          property="og:url"
          content={`http://sheetnhac.com/product/${product.slug.current}`}
        />
        <meta property="og:type" content="product" />
      </Head>
      <div className="product-detail-container justify-center px-2.5 py-0 xs:p-0 flex-wrap md:flex-nowrap lg:mx-10 lg:justify-start">
        <div>
          <div className="image-container justify-center flex aspect-square w-[250px] h-[250px] xs:w-[310px] xs:h-[310px] sm:w-[500px] sm:h-[500px] md:w-[380px] md:h-[380px] lg:w-[500px] lg:h-[500px]">
            <img
              src={urlFor(image && image[index]).toString()}
              className="product-detail-image w-full h-full object-cover"
            />
          </div>
          <div className="small-images-container justify-center">
            {image?.map((item: any, i: number) => (
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
          <h4 className="font-bold text-[16px] xs:text-[18px] sm:text-[24px] md:text-[20px] lg:text-[20px]">
            Details:{" "}
          </h4>
          <p className="text-[14px] xs:text-[16px] sm:text-[20px] md:text-[16px] lg:text-[17px]">
            {details}
          </p>

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
            image={urlFor(image && image[0])
              .width(200)
              .url()} // hình nhỏ
            url={`http://sheetnhac.com/product/${product.slug.current}`}
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
    </div>
  );
};

export const getStaticPaths = async () => {
  const query = `*[_type == "product"] {
    slug {
      current
    }
  }
  `;

  const products = await client.fetch(query);
  const paths = products.map((product: any) => ({
    params: {
      slug: product.slug.current,
    },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }: any) => {
  const query = `*[_type == "product" && slug.current == '${params.slug}'][0]`;
  const productsQuery = '*[_type == "product"]';

  const product = await client.fetch(query);
  const products = await client.fetch(productsQuery);

  return {
    props: { product, products },
  };
};

export default ProductDetails;
