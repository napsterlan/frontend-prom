import { useRouter } from 'next/router';
import {getNewsBySlug, getProductBySlug} from "@/api/apiClient";
import {News, Product} from "@/types/types";
import {HtmlContent} from "@/components/HtmlContent";
import Image from "next/image";
import {Images} from "@/types/types";
import Carousel from "@/components/Carousel/Carousel";
import {EmblaOptionsType} from "embla-carousel";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {BootstrapWrapper} from "@/components/BootstrapWrapper";

interface NewsPageProps {
  newsData: News;
}

export async function getServerSideProps({ params }: { params: { slug: string } }) {
  // Проверяем, существует ли параметр productSlug в объекте params
  if (!params?.slug) {
    console.log('slug отсутствует');
    return {
      notFound: true,
    };
  }

  try {
    const response = await getNewsBySlug(params.slug);
    if (!response || !response.data) {
      console.log('Данные продукта отсутствуют');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        newsData: {
          ...response.data,
        },
      },
    };



  } catch (error) {
    console.error('Ошибка в getServerSideProps:', error);
    return {
      notFound: true,
    };
  }
}

export default function NewsDetailPage({ newsData }: NewsPageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDE_COUNT = newsData.Images?newsData.Images.length:0;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  const thumbnailImage: Images = newsData.Images ? newsData.Images[0] : {} as Images;
  let postImages: Images[] = []
  if(SLIDE_COUNT > 1 && newsData.Images){
    postImages = newsData.Images
  }
  console.log(postImages)

  return (
      <>
        <Breadcrumbs/>
      <div className="container mx-auto px-4 max-w-[1140px]">


            <HtmlContent
                html={newsData?.Title?newsData?.Title:newsData?.Name}
                className="text-[32px] font-semibold text-center bootstrap-header"
            />


        {SLIDE_COUNT > 1 && (
          <Carousel  slides={SLIDES} options={OPTIONS} images={postImages}/>
        )}
        {SLIDE_COUNT == 1 && (
            <Image src={thumbnailImage.ImageURL}
                   alt={thumbnailImage.AltText}
                   width={1110}
                   height={625}
                   className="object-cover rounded-2xl !mb-[50px] !mt-[30px] m-auto"
            />
        )}
        <HtmlContent
            html={newsData?.Description?newsData?.Description:"N/A"}
            className="prose max-w-none"
        />
      </div>
      </>
        );
        }