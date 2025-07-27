import { useEffect, useState } from "react";
import { Product, FooterBanner, HeroBanner } from "../components";
import { IProduct, IBanner } from "../dto";
import { fetchProducts, fetchBanners } from "../lib/firestoreFetch";

const Home = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [bannerData, setBannerData] = useState<IBanner[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, bannersData] = await Promise.all([
          fetchProducts(),
          fetchBanners()
        ]);
        setProducts(productsData);
        setBannerData(bannersData);
        console.log("Products data from Firestore:", bannersData); // Kiểm tra dữ liệu
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
    <>
      <HeroBanner heroBanner={bannerData && bannerData[0]} />

      <div className="products-heading">
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>
      <div className="products-container">
        {products.map((product) => (
          <Product key={product._id} product={product} />
        ))}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]} />
    </>
  );
};

// export const getServerSideProps = async () => {
//   const query = '*[_type == "product"]';
//   const products = await client.fetch(query);

//   const bannerQuery = '*[_type == "banner"]';
//   const bannerData = await client.fetch(bannerQuery);

//   return {
//     props: { products, bannerData },
//   };
// };

export default Home;
