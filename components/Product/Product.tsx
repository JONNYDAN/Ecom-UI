import { IProduct } from "../../dto";
import Link from "next/link";
import { urlFor } from "../../lib/client";
import Image from "next/image";
interface Props {
  product: IProduct;
}

const Product = ({ product }: Props) => {
  const { images, name, slug, price } = product;
  return (
    <div>
      <Link href={`/product/${slug.current}`}>
        <div className="product-card">
          {images && images.length > 0 && (
            <Image
              src={urlFor(images[0]).url()}
              alt={name}
              width={250}
              height={250}
            />
          )}
          <p className="product-name">{name}</p>
          <p className="product-price">${price}</p>
        </div>
      </Link>
    </div>
  );
};

export default Product;
