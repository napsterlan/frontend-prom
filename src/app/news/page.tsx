
import {News, Project, ProjectCategory} from "@/types/types";
import {getAllProjectCategories, getAllNews} from "@/api/apiClient";
import {Breadcrumbs} from "@/app/_components/Breadcrumbs";
import Link from "next/link";
import Image from "next/image";
import { Pagination } from "@/app/_components/Pagination";
import {useState} from "react";
import {useRouter} from "next/router";

interface NewsPageProps {
    news: News[];
    currentPage: number;
    totalPages: number;
}

export async function getServerSideProps({query}: {query: {page: number}}) {
    const page = Number(query.page) || 1;
    try {
        const response = await getAllNews(page);
        return {
            props: {
                news: response.data,
                currentPage: page,
                totalPages: response.metadata.last_page, // Assuming your API returns total pages
            },
        };
    } catch (error) {
        return {
            props: {
                news: [],
                currentPage: 1,
                totalPages: 1,
            },
        };
    }
}

function formatNewsDate(publishDate: string ) {
    const date = new Date(publishDate);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    return day + "." + month + "." + date.getFullYear()
}

export default function NewsPage({ news, currentPage, totalPages }: NewsPageProps) {
    const router = useRouter();

    const handlePageChange = (page: number) => {
        router.push({
            pathname: '/news',
            query: { page },
        }, undefined, { scroll: true });
    };
  return (<>
      <Breadcrumbs/>

      <div className="container mx-auto px-4">

          <div className="flex justify-center items-center mb-6">
              <h1 className="text-[32px] font-bold">Новости</h1>
          </div>
          <div className='flex flex-col items-center'>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                  {news.map(_news => (
                      <Link href={`/news/${_news.Slug}`}
                            key={_news.ID}
                          className="w-full max-w-[350px] bg-white border rounded-xl border-gray-200 shadow-sm ">
                          {_news.Images?.[0] && (
                                      <Image
                                          src={_news.Images[0].ImageURL}
                                          alt={_news.Images[0].AltText}
                                          className="w-full h-48 object-cover rounded-xl mb-4 border-b-1"
                                          width={350}
                                          height={194}
                                          priority={false}
                                          onError={(e) => {
                                              // @ts-expect-error fail back image on error
                                              e.target.src = "./placeholder.png"; // Your fallback image path
                                          }}
                                      />
                                  )}
                          <div className='flex flex-col h-[110px] font-Manrope px-[10px] justify-between text-left pb-[10px]'>
                              <div >
                                  <h4 className="text-[19.6px] font-semibold mb-[14px] tracking-[-.05em] leading-6">{_news.Name}</h4>
                              </div>
                              <span className="text-[14px] text-[#999] font-bold text-left">
                                  {_news.PublishDate?formatNewsDate(_news.PublishDate):"Не удалось загрузить дату"}
                              </span>
                          </div>
                      </Link>   ))}
              </div>
          </div>
          {totalPages > 1 && (
              <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
              />
          )}
      </div>
      </>

);}