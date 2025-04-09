
import { INews } from "@/types";
import {getAllNews} from "@/api";
import Link from "next/link";
import Image from "next/image";
import { PaginatedNewsPage } from "./_components/PaginatedNewsPage";
import { useBreadCrumbs } from "../_components/breadcrumbs/breadcrumbs-context";

function formatNewsDate(publishDate: string ) {
    const date = new Date(publishDate);
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    return day + "." + month + "." + date.getFullYear()
}


export default async function NewsPage({
    searchParams,
}: {
    searchParams: {page?: string}
}) {
    const page = Number(searchParams.page) || 1;
    let news: INews[] = [];
    let totalPages = 1;
    try {
        const response = await getAllNews(page);
        news = response.data;
        totalPages = response.metadata.last_page;
    } catch (error) {
        console.error("Error fetching news:", error);
    }
  return (<>

      <div className="">

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
                                          src={_news.Images[0].ImageURL?_news.Images[0].ImageURL:"./placeholder.png"}
                                          alt={_news.Images[0].AltText}
                                          className="w-full h-48 object-cover rounded-xl mb-4 border-b-1"
                                          width={350}
                                          height={194}
                                          priority={false}
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
              <PaginatedNewsPage
                  currentPage={page}
                  totalPages={totalPages}
              />
          )}
      </div>
      </>

);}


