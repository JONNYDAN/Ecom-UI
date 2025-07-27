import { IProduct } from "../../dto";
import Link from "next/link";
import { urlFor } from "../../lib/client";

interface Props {
  product: IProduct;
}

const Product = ({ product: { images, name, slug, price } }: Props) => {
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          <img
            src={images && urlFor(images[0]).url()}
            width={250}
            height={250}
            className="product-image"
            alt={`${name}`}
          />
          <p className="product-name">{name}</p>
          <p className="product-price">${price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
