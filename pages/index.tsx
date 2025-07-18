import { Product, FooterBanner, HeroBanner } from "../components";
import { IBanner, IProduct } from "../dto";
import { client } from "../lib/client";
import { getProductsFromFirebase } from "../lib/firebaseHelper";
import ImageUploader from '../components/Image/ImageUploader';

interface Props {
  products: IProduct[];
  bannerData: IBanner[];
}

const Home = ({ products, bannerData }: Props) => {
  return (
    <>
      {/* <HeroBanner heroBanner={bannerData && bannerData[0]} /> */}

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className="products-container">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <p className="product-name">{product.name}</p>
            <p className="product-price">
              {product.price.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '3rem' }}>
        <h3>Thêm ảnh mới (lưu lên Firebase):</h3>
        <ImageUploader />
      </div>


      {/* <FooterBanner footerBanner={bannerData && bannerData[0]} /> */}
    </>
  );
};

export const getServerSideProps = async () => {
  const products = await getProductsFromFirebase();      
  // const bannerData = await getBannersFromFirebase();     

  return {
    props: { products },
  };
};


export default Home;
