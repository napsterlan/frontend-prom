import { useRouter } from 'next/router';
import {getNewsBySlug, getProductBySlug, getProjectBySlug} from "@/api/apiClient";
import {News, Product, Project} from "@/types/types";
import {HtmlContent} from "@/components/HtmlContent";
import Image from "next/image";
import {Images} from "@/types/types";
import Carousel from "@/components/Carousel/Carousel";
import {EmblaOptionsType} from "embla-carousel";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {BootstrapWrapper} from "@/components/BootstrapWrapper";

interface ProjectPageProps {
  projectData: Project;
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
    const response = await getProjectBySlug(params.slug);
    if (!response || !response.data) {
      console.log('Данные продукта отсутствуют');
      return {
        notFound: true,
      };
    }

    return {
      props: {
        projectData: {
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

export default function ProjectDetailPage({ projectData }: ProjectPageProps) {
  const router = useRouter();
  const { slug } = router.query;
  const OPTIONS: EmblaOptionsType = { loop: true }
  const SLIDE_COUNT = projectData.Images?projectData.Images.length:0;
  const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
  const thumbnailImage: Images = projectData.Images ? projectData.Images[0] : {} as Images;
  let postImages: Images[] = []
  if(SLIDE_COUNT > 1 && projectData.Images){
    postImages = projectData.Images
  }
  console.log(postImages)

  return (
      <>
        <Breadcrumbs/>
      <div className="container mx-auto px-5 max-w-[1140px]">


            <HtmlContent
                html={projectData?.Name?projectData?.Name:projectData?.Name}
                className="text-[32px] font-semibold text-center bootstrap-header leading-[1]"
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
        <div className="flex flex-col md:flex-row gap-8 w-full">
          <HtmlContent
              html={projectData?.Description ? projectData?.Description : "N/A"}
              className="prose max-w-none "
          />
          <div className="col-sm-5 flex w-[100%] !pr-0 justify-end">
            <Image className="media-object h-[100px] md:h-[150px]"
                   height={150}
                   width={150}
                   src={projectData.User?.ImageURL}
                   alt="Менеджер проекта"/>

            <div className="pr-2.5 pl-2.5 text-[14px] max-w-[155px]" >
              <div className="table-cell">
                <div className="pl-0 table-cell align-top">
                  <div className="text-[#333] mt-0 text-[18px] mb-1.5 leading-[22px]">
                    {projectData.User?.FirstName} {projectData.User?.LastName}
                  </div>
                  <div className="text-[14px] leading-3 mb-2.5 text-[#ccc]">Менеджер проекта</div>
                  <div className="p-0 mb-2">
                    <a href={`tel: ${projectData.User?.Phone}`} className="text-[#454545]">{projectData.User?.Phone}</a>
                  </div>
                  <div className="text-[14px] leading-3 mb-2.5 ">
                    <a href={`mailto:${projectData.User?.Email}`} className="text-[#454545]">{projectData.User?.Email}</a>
                  </div>
                </div>
              </div>
            </div>
            <Image
                className="media-object h-[100px] md:h-[150px]"
                src={projectData.User?.QRCodeURL}
                alt="QR-код"
                width={150} height={150}/>
          </div>
        </div>

      </div>
      </>
  );
}