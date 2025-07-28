import { IBanner } from "../../dto";
import Link from "next/link";
import { urlFor } from "../../lib/client";

interface Props {
  footerBanner: IBanner;
}

const FooterBanner = ({ footerBanner }: Props) => {
  return (
    <div className="footer-banner-container py-10 px-0 rounded-none sm:rounded-2xl sm:py-16 sm:px-10 md:px-[40px] xl:py-[100px] xl:px-[70px]">
      <div className="banner-desc flex-col sm:flex-row">
        <div className="left text-center mb-10 sm:m-0 sm:text-left sm:self-center">
          <p className="pb-4 lg:pb-8 md:text-[18px] lg:text-[20px]">{footerBanner.discount}</p>
          <h3 className="text-5xl sm:text-4xl md:text-[45px] md:mb-4 lg:mb-8 lg:text-[80px]">
            {footerBanner.largeText1}
          </h3>
          <h3 className="text-5xl sm:text-4xl md:text-[45px] md:mb-4 lg:mb-8 lg:text-[80px]">
            {footerBanner.largeText2}
          </h3>
          <p className="pt-4 lg:pt-8 lg:text-[20px]">{footerBanner.saleTime}</p>
        </div>
        <div className="right text-center sm:text-left sm:self-center">
          <p className="pb-2 lg:pb-4 md:text-[18px] lg:text-[20px]">{footerBanner.smallText}</p>
          <h3 className="text-5xl sm:text-4xl md:text-[45px] lg:text-[60px]">
            {footerBanner.midText}
          </h3>
          <p className="pt-4 lg:pt-8 md:text-[18px] lg:text-[20px]">{footerBanner.desc}</p>
          <Link href={`/product/${footerBanner.product}`}>
            <button className="mt-[20px] md:mt-[16px] lg:mt-[30px]" type="button">
              {footerBanner.buttonText}
            </button>
          </Link>
        </div>
        <div
          className="self-center w-[300px] h-[300px] 
                  sm:absolute sm:right-[45%] sm:top-[10%] sm:w-[225px] sm:h-[225px] 
                  md:w-[325px] md:h-[325px] md:top-[-10%] md:right-[40%]
                  lg:w-[450px] lg:h-[450px] lg:top-[-15%] lg:right-[35%]
                  xl:w-[600px] xl:h-[600px] xl:top-[-30%] xl:right-[33%]"
        >
          <img
            src={urlFor(footerBanner.images[0]).toString()}
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </div>
  );
};

export default FooterBanner;
