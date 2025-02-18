import {getAllNews, getAllProjectCategories, getAllProjects, searchFor} from '@/api/apiClient';
import {Category, News, Project, ProjectCategory} from '@/types/types';
import { Breadcrumbs } from '@/app/_components/Breadcrumbs';
import Link from 'next/link';
import Image from 'next/image';
import {Pagination} from "@/app/_components/Pagination";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {HtmlContent} from "@/app/_components/HtmlComponent/HtmlContent";

interface SearchResult {
    id: number;
    name: string;
    href: string;
    date: string;
    image: string;
    score: number;
}

interface ProjectsPageProps {
    projects: Project[];
    categories: ProjectCategory[];
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    searchQuery?: string;
}

export async function getServerSideProps({query}: {query: {page: number, category?: string, search?: string}}) {
    const page = Number(query.page) || 1;
    const category = query.category || "";
    const search = query.search || "";
  // let projects: Project[] = [];
  // let categories: ProjectCategory[] = [];
//   let error = null;
    try {
        let response;
        let projects;
        if (search) {
            const searchParams = new URLSearchParams({
                query: search,
                searchType: "projects",
                page: page.toString(),
                ...(category && { category }) // Add category parameter if it exists
            });

            // Handle search results

            const searchResponse = await searchFor(search, "projects", page, ...(category && { category }));
            // Transform search results into Project format
            console.log(searchResponse)
            projects = searchResponse.projects.map((result: SearchResult) => ({
                ID: result.id,
                Name: result.name,
                Slug: result.href,
                PublishDate: result.date,
                Images: result.image ? [{
                    ImageURL: result.image,
                    AltText: result.name
                }] : [],
                // Add other required Project fields with default values if needed
            }));
            console.log(projects)


            response = {
                data: projects,
                metadata: {
                    last_page: searchResponse.metadata?.last_page || 1,
                    total_records: searchResponse.metadata?.total_records || searchResponse.data.length,
                }
            };
            console.log(response)
        } else {
            // Use regular projects endpoint when no search
            response = await getAllProjects(page, category);
        }
        const catResponse = await getAllProjectCategories();
        return {
            props: {
                projects: response.data,
                categories: catResponse.data,
                currentPage: page,
                totalPages: response.metadata.last_page,
                totalRecords: response.metadata.total_records,
                searchQuery: search,
            },
        };
    } catch (error) {
        return {
            props: {
                news: [],
                currentPage: 1,
                totalPages: 1,
                totalRecords: 0,
                searchQuery: "",
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

//{ news, currentPage, totalPages }: NewsPageProps
export default function ProjectsPage({projects, categories, currentPage, totalPages, totalRecords, searchQuery}: ProjectsPageProps ) {
    const router = useRouter();
    const currentCategory = router.query.category as string;
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState(searchQuery || "");

    let currentCategoryData = null
    if (categories) {
         currentCategoryData = categories.find(x=>x.Slug === currentCategory) || null;
    }

    useEffect(() => {
        const handleStart = () => setIsLoading(true);
        const handleComplete = () => setIsLoading(false);

        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push({
            pathname: '/projects',
            query: {
                page: 1,
                ...(currentCategory && { category: currentCategory }),
                ...(searchTerm && { search: searchTerm })
            },
        });
    };


    const handlePageChange = (page: number) => {
        router.push({
            pathname: '/projects',
            query: { page, ...(currentCategory && { category: currentCategory })  },
        }, undefined, { scroll: true });
    };
    const clearCategory = () => {
        router.push({
            pathname: '/projects',
            query: { page: 1 },
        });
    };
  return (
      <>
          <Breadcrumbs/>

          <div className="container mx-auto px-4">
              <div className="flex gap-6">
              {/* Categories Sidebar */}
              <div className="hidden md:block w-64 flex-shrink-0 pt-5">
                  <h2 className="text-xl font-bold mb-4 text-[20px]">Категории</h2>
                  {currentCategory && (

                          <button
                              onClick={clearCategory}
                              className="all-projects-link"
                          >
                              ← Все проекты
                          </button>

                  )}
                  <ul className="categories-menu">

                      {Array.isArray(categories) && categories.map((category) => (
                          <li key={category.ID || 'fallback-key'}>
                              <Link
                                  href={{
                                      pathname: '/projects',
                                      query: { category: category?.Slug },
                                  }}
                                  className={`category-link ${
                                      currentCategory === category?.Slug ? 'active' : ''
                                  } ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
                              >
                                  {category?.Name || 'Unnamed Category'}
                              </Link>
                          </li>
                      ))}
                  </ul>
              </div>
              {/* Main Content */}
                  <div className="flex-1">
                      <div className="flex justify-center items-center mb-6 flex-col leading-[1]">
                          <h1 className="text-[32px] font-bold">Проекты</h1>
                          <div className="mt-2.5 text-[22px]">
                              {Array.isArray(categories) && categories.find(cat => cat.Slug === currentCategory)?.Name || ""}
                          </div>
                      </div>
                      <div className="flex justify-end text-[18px] mb-4 px-[5%] justify-between">
                          <div className="flex-1 flex items-center justify-center min-w-[360px]">
                              <form onSubmit={handleSearch} className="w-full flex">
                                  <input
                                      type="text"
                                      value={searchTerm}
                                      onChange={(e) => setSearchTerm(e.target.value)}
                                      className="w-full h-[37px] leading-[27px] pl-5 shadow-none rounded-l-[20px] bg-[#e9e9e9] text-[#333] text-base font-commissioner font-extralight border-none outline-none focus:outline-none placeholder:text-[rgba(255,255,255,0.70)] placeholder:text-[15px] placeholder:font-manrope placeholder:font-small"
                                      placeholder="Поиск проектов..."
                                  />
                                  <button
                                      type="submit"
                                      className="flex items-center h-[37px] text-[13px] leading-[40px] pr-3 align-top text-[#d5d5d5] rounded-r-[20px] bg-[#e9e9e9]"
                                  >
                                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"
                                           fill="none">
                                          <path
                                              d="M16.8271 18C16.5077 17.9051 16.2865 17.6877 16.0613 17.4623C14.7056 16.0983 13.3459 14.7343 11.9902 13.3743C11.9452 13.3268 11.9042 13.2754 11.8592 13.224C9.82776 14.5169 7.65709 14.8806 5.33898 14.2124C3.62292 13.7182 2.25908 12.7219 1.26795 11.2828C-0.874054 8.17127 -0.247427 4.08322 2.73417 1.68732C5.57243 -0.589975 9.58202 -0.542531 12.3547 1.71104C13.9316 2.99202 14.8408 4.64068 15.021 6.63331C15.2012 8.62199 14.5991 10.3853 13.2926 11.943C13.3786 12.03 13.4606 12.117 13.5466 12.2C14.9186 13.5759 16.2865 14.9517 17.6586 16.3237C18.0845 16.7507 18.1214 17.32 17.7159 17.6995C17.5766 17.83 17.3678 17.8972 17.1917 17.996C17.0688 18 16.95 18 16.8271 18ZM7.53012 1.90872C4.4748 1.90477 1.98058 4.31253 1.97239 7.26984C1.9642 10.2232 4.48709 12.6586 7.53832 12.6389C10.6141 12.6191 13.092 10.2272 13.0879 7.2738C13.0838 4.31648 10.5895 1.90872 7.53012 1.90872Z"
                                              fill="#a1a1a1"></path>
                                      </svg>
                                  </button>
                              </form>
                          </div>
                          <div>
                              Опубликовано проектов: <span className="text-PLGreen font-bold ">{totalRecords}</span>
                          </div>
                      </div>

                      <div className='flex flex-col items-center'>
                          {isLoading ? (
                              <div className="w-full text-center py-8">
                                  Загрузка...
                              </div>
                          ) : (
                              <div
                                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                                  {Array.isArray(projects) && projects.map(project => (
                                      <Link href={`/projects/${project.Slug}`}
                                            key={project.ID}
                                            className="w-full max-w-[350px] bg-white border rounded-xl border-gray-200 shadow-sm ">
                                          {project.Images?.[0] && (
                                              <Image
                                                  src={project.Images[0].ImageURL}
                                                  alt={project.Images[0].AltText}
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
                                          <div
                                              className='flex flex-col h-[110px] font-Manrope px-[10px] justify-between text-left pb-[10px]'>
                                              <div>
                                                  <h4 className="text-[19.6px] font-semibold mb-[14px] tracking-[-.05em] leading-6">{project.Name}</h4>
                                              </div>
                                              <span className="text-[14px] text-[#999] font-bold text-left">
                                      {project.PublishDate ? formatNewsDate(project.PublishDate) : "Не удалось загрузить дату"}
                                  </span>
                                          </div>
                                      </Link>
                                  ))}
                              </div>
                          )}
                      </div>

                      {!isLoading && totalPages > 1 && (
                          <Pagination
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={handlePageChange}
                          />
                      )}


                      <div className="mt-5">
                          {currentCategoryData?.Description && (
                              <HtmlContent
                              html={currentCategoryData?.Description}
                              className="leading-[1]"
                          />)}

                      </div>
                  </div>

              </div>


          </div>
      </>
      // <div className="container mx-auto px-4">
      //   <Breadcrumbs />
      //
      //   <div className="flex justify-between items-center mb-6">
      //     <h1 className="text-2xl font-bold">Проекты</h1>
    //   </div>
    //
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {projects.map(project => (
    //       <Link href={`/projects/${project.Slug}`} key={project.ID} className="relative border rounded-lg p-4">
    //         {project.ProjectImages?.[0] && (
    //           <Image
    //             src={project.Images[0].ImageURL}
    //             alt={project.Images[0].AltText}
    //             className="w-full h-48 object-cover rounded mb-4"
    //             width={500}
    //             height={192}
    //             priority={false}
    //           />
    //         )}
    //         <h3 className="text-xl font-semibold mb-2">{project.Name}</h3>
    //         <p className="text-gray-600">{project.Description}</p>
    //       </Link>
    //     ))}
    //   </div>
    // </div>
  );
} 