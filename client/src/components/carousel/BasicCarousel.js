import React from "react";
import Carousel from "react-material-ui-carousel";
import BasicTag from "../tag/BasicTag";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";

const BasicBannerCarousel = ({
  data,
  className,
  animationSpeed = 500,
  autoplaySpeed = 7000,
  stopAutoPlayOnHover = true,
  animation = "slide",
  itemComponent = () => {},
  ...props
}) => {
  return (
    <Carousel
      className={`mt-4 ${className}`}
      animation={animation}
      duration={animationSpeed}
      interval={autoplaySpeed}
      stopAutoPlayOnHover={stopAutoPlayOnHover}
      {...props}
    >
      {data.map((item, i) => itemComponent(item, i))}
    </Carousel>
  );
};

export const BasicBannerCarouselItem = ({ item }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ "--image-url": `url(${item?.imgUrl})` }}
      className={`h-72 bg-gray-200 rounded-md bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center`}
    >
      <div className="px-4 py-4 h-full flex gap-4 backdrop-blur-lg bg-white/90">
        <img
          onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(1)}`)}
          className="w-48 object-contain cursor-pointer"
          src={item?.imgUrl}
          alt="img"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h3
              className="font-bold text-4xl cursor-pointer"
              onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(1)}`)}
            >
              {item.name}
            </h3>
            <div className="mt-2 flex gap-1">
              {item.genres.map((genre) => (
                <BasicTag label={genre}></BasicTag>
              ))}
            </div>
            <div className="mt-2">{item.description}</div>
          </div>
          <div className="flex justify-between">
            <h4 className="text-lg font-semibold">{item.author}</h4>
            <h4 className="text-lg font-semibold">No.1</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicBannerCarousel;
