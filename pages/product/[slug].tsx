import { useState } from "react";
import { client, urlFor } from "../../lib/client";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";

import Head from 'next/head';
import ShareButtons  from "../../components/ShareButtons";
import PaymentModal from "../../components/PaymentModal";

const ProductDetails = ({ product, products }: any) => {
  const { image, name, details, price } = product;
  const [index, setIndex] = useState(0);
  const { decreaseQty, increaseQty, qty, onAdd } = useStateContext();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  return (
    <div>
      <Head>
        <title>{name}</title>
        <meta property="og:title" content={name}/>
        <meta property="og:description" content={details}/>
        <meta property="og:image" content={urlFor(image && image[0]).width(200).url()}/>
        <meta property="og:url" content={`http://sheetnhac.com/product/${product.slug.current}`}/>
        <meta property="og:type" content="product" />
      </Head>
      <div className="product-detail-container">
        <div>
          <div className="image-container">
            <img
              src={urlFor(image && image[index]).toString()}
              className="product-detail-image"
            />
          </div>
          <div className="small-images-container">
            {image?.map((item: any, i: number) => (
              <img
                key={i}
                src={urlFor(item).toString()}
                className={
                  i === index ? "small-image selected-image" : "small-image"
                }
                onMouseEnter={() => {
                  setIndex(i);
                }}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div>
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details: </h4>
          <p>{details}</p>
          

          <p className="price">${price}</p>
          
          <div className="quantity">
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" onClick={() => {}}>
                {qty}
              </span>
              <span className="plus" onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <ShareButtons
            name={name}
            details={details}
            image={urlFor(image && image[0]).width(200).url()} // hình nhỏ
            url={`http://sheetnhac.com/product/${product.slug.current}`}
          />

          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() => onAdd(product, qty)}
            >
              Add to Cart
            </button>
            <button
              type="button"
              className="buy-now"
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
        <h2>You may also like</h2>
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
