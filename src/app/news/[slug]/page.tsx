import { notFound } from 'next/navigation'
import { getNewsBySlug } from "@/api";
import { INews, IImages } from "@/types";
import { HtmlContent } from "@/app/_components/HtmlComponent/HtmlContent";
import Image from "next/image";
import Carousel from "@/app/_components/Carousel/Carousel";
import { EmblaOptionsType } from "embla-carousel";
import BreadcrumbsWrapper from '@/app/_components/BreadcrumbsWrapper';
import { NextPageProps } from '@/types';

export async function generateMetadata({ params, searchParams }: NextPageProps) {
    try {
      const { slug } = await params;
      if (!slug) {
        notFound();
      }
      const response = await getNewsBySlug(slug);
      
      if (!response || !response.data) {
        notFound();
      }
      
      return {
        title: response.data.Title || response.data.Name,
        description: response.data.Description ? response.data.Description.slice(0, 160) : undefined,
      };
    } catch (error) {
      notFound();
    }
}

export default async function NewsDetailPage({ params, searchParams }: NextPageProps) {
    const { slug } = await params;
    if (!slug) {
        notFound();
    }

    let newsData: INews;

    try {
        const response = await getNewsBySlug(slug);
        if (!response || !response.data) {
            notFound();
        }
        newsData = response.data;
    } catch (error) {
        console.error('Ошибка в getServerSideProps:', error);
        notFound();
    }

    const OPTIONS: EmblaOptionsType = { loop: true }
    const SLIDE_COUNT = newsData.Images?newsData.Images.length:0;
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
    const thumbnailImage: IImages = newsData.Images ? newsData.Images[0] : {} as IImages;
    let postImages: IImages[] = []
    
    if (SLIDE_COUNT > 1 && newsData.Images) {
        postImages = newsData.Images;
    }

    return (
        <BreadcrumbsWrapper pageName={newsData.Name || ""}>
            <div className="container mx-auto px-4 max-w-[1140px]">
                <HtmlContent
                    html={newsData?.Title?newsData?.Title:newsData?.Name || ""}
                    className="text-[32px] font-semibold text-center bootstrap-header"
                />

                {SLIDE_COUNT > 1 && (
                    <Carousel slides={SLIDES} options={OPTIONS} images={postImages}/>
                )}
                {SLIDE_COUNT == 1 && (
                    <Image src={thumbnailImage.ImageURL}
                        alt={thumbnailImage.AltText || ""}
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
        </BreadcrumbsWrapper>
    );
}