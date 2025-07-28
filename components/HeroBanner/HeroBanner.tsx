import Link from "next/link";
import { IBanner } from "../../dto";
import { urlFor } from "../../lib/client";

type Props = {
  heroBanner: IBanner;
};

const HeroBanner = ({ heroBanner }: Props) => {
  return (
    <div className="hero-banner-container py-10 px-0 rounded-none sm:rounded-2xl sm:py-[100px] sm:px-5 xl:py-[125px]">
      <div>
        <p className="beats-solo text-md text-center sm:text-left sm:ml-2 md:text-lg lg:ml-3 lg:text-xl xl:text-2xl xl:ml-4">
          {heroBanner.smallText}
        </p>
      </div>
      <h3 className="text-4xl font-bold text-center sm:text-left sm:ml-2 sm:text-4xl md:text-5xl lg:ml-3 lg:text-6xl xl:text-7xl">
        {heroBanner.midText}
      </h3>
      <h1 className="text-8xl font-bold text-center sm:text-left md:text-9xl lg:text-[160px] xl:text-[200px]">
        {heroBanner.largeText1}
      </h1>
      <div className="justify-self-center aspect-square w-[300px] h-[300px] sm:absolute sm:right-[10%] sm:top-[0%] sm:w-[350px] sm:h-[350px] md:w-[400px] md:h-[400px] lg:w-[470px] lg:h-[470px] lg:right-[20%] xl:w-[550px] xl:h-[550px]">
        <img
          src={heroBanner.images && urlFor(heroBanner.images[0]).url()}
          alt="headphones"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-col flex">
        <Link href={`/product/${heroBanner.product}`}>
          <button
            className="self-center w-[150px] h-[50px] sm:ml-0 sm:mt-[20px] sm:ml-1 sm:self-start lg:ml-3"
            type="button"
          >
            {heroBanner.buttonText}
          </button>
        </Link>
        <div className="desc hidden mr-4 sm:flex sm:mr-0 sm:absolute sm:bottom-[10%] sm:right-[5%] md:text-lg">
          <h5 className="md:text-xl">Description</h5>
          <p>{heroBanner.desc}</p>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
