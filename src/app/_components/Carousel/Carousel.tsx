"use client"

import {IImages} from "@/types";
import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from 'embla-carousel-react'
import { EmblaOptionsType } from 'embla-carousel'
import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from './CarouselArrowButtons'
import { DotButton, useDotButton } from './CarouselDotButton'
import {useCallback, useEffect, useState} from "react";
interface CarouselProps {
    images: IImages[]
    // onPageChange: (page: number) => void;
}
type PropType = {
    slides: number[]
    images: IImages[]
    options?: EmblaOptionsType
}

const Carousel: React.FC<PropType> = (props) => {
    const {slides, images, options } = props
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const fullscreenOptions: EmblaOptionsType = {
        align: 'center',
        containScroll: false,
        loop: true,
        active: !isZoomed,  // Disable drag when zoomed
        inViewThreshold: 1, // Add this to improve slide visibility
        // speed: 10,            // Add this to make transitions smoother
        skipSnaps: false ,
        duration: 25
    }
    const [fullscreenEmblaRef, fullscreenEmblaApi] = useEmblaCarousel({
        ...fullscreenOptions,
        startIndex: selectedIndex
    })

    // useEffect(() => {
    //     if (isFullscreen && fullscreenEmblaApi) {
    //         fullscreenEmblaApi.scrollTo(selectedIndex);
    //     }
    // }, [isFullscreen, fullscreenEmblaApi, selectedIndex]);

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => {
            const currentIndex = emblaApi.selectedScrollSnap();
            setSelectedIndex(currentIndex);
        }

        emblaApi.on('select', onSelect);
        return () => emblaApi.off('select', onSelect);
    }, [emblaApi]);

    useEffect(() => {
        if (!fullscreenEmblaApi) return;

        const onSelect = () => {
            const currentIndex = fullscreenEmblaApi.selectedScrollSnap();
            setSelectedIndex(currentIndex);
        }

        fullscreenEmblaApi.on('select', onSelect);
        return () => fullscreenEmblaApi.off('select', onSelect);
    }, [fullscreenEmblaApi]);
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isFullscreen]);


    useEffect(() => {
        if (isFullscreen && fullscreenEmblaApi) {
            if (fullscreenEmblaApi.selectedScrollSnap() !== selectedIndex) {
                fullscreenEmblaApi.scrollTo(selectedIndex);
            }
        }
        if (!isFullscreen && emblaApi) {
            if (emblaApi.selectedScrollSnap() !== selectedIndex) {
                emblaApi.scrollTo(selectedIndex, true);
            }
        }
    }, [selectedIndex, isFullscreen, emblaApi, fullscreenEmblaApi]);
    useEffect(() => {
        if (fullscreenEmblaApi) {
            fullscreenEmblaApi.reInit()
        }
    }, [isZoomed, fullscreenEmblaApi]);

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsFullscreen(false);
                setIsZoomed(false);
            }
        };

        if (isFullscreen) {
            window.addEventListener('keydown', handleEscKey);
        }

        return () => {
            window.removeEventListener('keydown', handleEscKey);
        };
    }, [isFullscreen]);


    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isFullscreen || isZoomed) return;

            if (event.key === 'ArrowLeft' && fullscreenEmblaApi) {
                fullscreenEmblaApi.scrollPrev();
            } else if (event.key === 'ArrowRight' && fullscreenEmblaApi) {
                fullscreenEmblaApi.scrollNext();
            }
        };

        if (isFullscreen) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isFullscreen, isZoomed, fullscreenEmblaApi]);

    // Handle click outside
    const handleBackdropClick = useCallback((event: React.MouseEvent) => {
        console.log(event);
        const target = event.target as HTMLElement;
        if (target.classList.contains('embla__slide') || target.classList.contains('carousel-backdrop')) {
            setIsFullscreen(false);
            setIsZoomed(false);
        }
    }, []);

    const { scrollSnaps, onDotButtonClick } =
        useDotButton(emblaApi)
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const {
        prevBtnDisabled: fullscreenPrevBtnDisabled,
        nextBtnDisabled: fullscreenNextBtnDisabled,
        onPrevButtonClick: fullscreenPrevButtonClick,
        onNextButtonClick: fullscreenNextButtonClick
    } = usePrevNextButtons(fullscreenEmblaApi)

    const handleSlideClick = () => {
        if (emblaApi) {
            const currentIndex = emblaApi.selectedScrollSnap();
            setSelectedIndex(currentIndex);
            setIsFullscreen(true);
        }
    };

    const handleFullscreenImageClick = () => {
        setIsZoomed(!isZoomed);
    };

    return (
        <>
        <section className="embla relative !mb-[50px] !mt-[30px]">
            <div className="embla__viewport rounded-2xl" ref={emblaRef}>

                <div className="embla__container">
                    {slides.map(index => (
                        <div className="embla__slide" key={index} onClick={handleSlideClick}>
                            <Image src={images[index].ImageURL?images[index].ImageURL:'/placeholder.png'}
                                   fill={true}
                                   alt={images[index].AltText}
                            className='!relative'/>
                        </div>
                    ))}

                </div>
            </div>
            <div
                className="embla__controls absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none bg-gray-800 px-2">
                <div className="pointer-events-auto">
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled}/>
                </div>
                <div className="pointer-events-auto">
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled}/>
                </div>
            </div>
            <div className="embla__dots absolute bottom-0 left-0 right-0 -translate-y-1/2 flex justify-center px-2">
                {scrollSnaps.map((_, index) => (
                    <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        className={'embla__dot'.concat(
                            index === selectedIndex ? ' embla__dot--selected' : ''
                        )}
                    />
                ))}
            </div>

        </section>

    {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center " onClick={handleBackdropClick}>
            <button
                onClick={() => {
                    setIsFullscreen(false)
                    setIsZoomed(false);
                }
                }
                className="absolute top-4 right-4 text-white z-50 p-2 hover:bg-gray-800 rounded-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>

            <button
                onClick={handleFullscreenImageClick}
                className="absolute top-4 right-16 text-white z-50 p-2 hover:bg-gray-800 rounded-full"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d={isZoomed
                              ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
                              : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"}
                    />
                </svg>
            </button>

            <div className="w-full !h-full carousel-backdrop">
                <div className="embla !h-full" ref={fullscreenEmblaRef}>
                    <div className="embla__container !h-full">
                        {slides.map(index => {
                            const isSelected = selectedIndex === index;
                            const isPrev = (
                                selectedIndex === 0 && index === slides.length - 1 ||
                                index === selectedIndex - 1
                            );
                            const isNext = (
                                selectedIndex === slides.length - 1 && index === 0 ||
                                index === selectedIndex + 1
                            );

                            return (
                                <div
                                    className={`embla__slide relative h-full transition-all duration-300 ease-out 
                                    ${isZoomed&&!isSelected?'hidden':'block'}  
                                    ${isSelected ? 'opacity-100' : 'opacity-20'}`}
                                    key={index}>
                                    <Image
                                        src={images[index].ImageURL?images[index].ImageURL:'/placeholder.png'}
                                        fill={true}
                                        className={`object-contain transition-transform duration-300 ease-out !h-auto !m-auto
                                         ${isZoomed ? 'scale-150' : 'scale-100'}`}
                                        alt={images[index].AltText}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
                {!isZoomed && (
                <div
                    className="embla__controls absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
                    <div className="pointer-events-auto">
                        <PrevButton
                            onClick={fullscreenPrevButtonClick}
                            disabled={fullscreenPrevBtnDisabled}
                        />
                    </div>
                    <div className="pointer-events-auto">
                        <NextButton
                            onClick={fullscreenNextButtonClick}
                            disabled={fullscreenNextBtnDisabled}
                        />
                    </div>
                </div>)}
            </div>
        </div>
    )}
        </>
    )
}

export default Carousel