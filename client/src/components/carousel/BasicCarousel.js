import React from "react";
import Carousel from "react-material-ui-carousel";
import BasicTag from "../tag/BasicTag";
import { useNavigate } from "react-router-dom";
import { PAGE_PATH } from "../../routes/page-path";
import { Skeleton } from "@mui/material";
import AsyncImage from "../AsyncImage";

const BasicBannerCarousel = ({
  data,
  isLoading,
  className,
  animationSpeed = 500,
  autoplaySpeed = 7000,
  stopAutoPlayOnHover = true,
  animation = "slide",
  itemComponent = () => {},
  ...props
}) => {
  return isLoading ? (
    <div className="py-4">
      <Skeleton variant="rounded" height={288}></Skeleton>
    </div>
  ) : (
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

export const BasicBannerCarouselItem = ({ item, index }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        "--image-url": `url(${
          item.thumbUrl !== "" ? item.thumbUrl : "/images/no_manga_thumb.png"
        })`,
      }}
      className={`h-64 lg:h-72 bg-gray-200 rounded-md bg-[image:var(--image-url)] bg-no-repeat bg-cover bg-center`}
    >
      <div className="px-4 py-4 w-full h-full flex gap-4 backdrop-blur-lg bg-white/90">
        <div className="basis-1/8">
          <div className="lg:w-48 w-32 lg:h-full h-fit select-none">
            <AsyncImage
              imgClassName="object-fit"
              src={item?.thumbUrl}
              skeletonHeight={256}
              alt="img"
            />
          </div>
        </div>
        <div className="basis-7/8 w-full flex flex-col justify-between">
          <div>
            <h3
              className="font-bold text-4xl cursor-pointer line-clamp-1 h-fit"
              onClick={() => navigate(`${PAGE_PATH.MANGA_DETAIL(item?._id)}`)}
            >
              {item.name}
            </h3>
            <div className="mt-2 flex flex-wrap gap-1">
              {item.genres.map((genre, index) => (
                <BasicTag key={index} label={genre.name}></BasicTag>
              ))}
            </div>
            <div className="mt-2 line-clamp-4 lg:line-clamp-5 select-none">
              {item.description}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold">
                {item.authors.join(",")}
              </h4>
              <h4
                className={`text-lg font-semibold ${
                  index === 1 ? "text-orange-500" : ""
                }`}
              >
                No.{index}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicBannerCarousel;
