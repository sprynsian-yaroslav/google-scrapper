import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Icon from "../Icon";
import classnames from "classnames";
import classes from "./Swiper.module.scss"

import { debounce } from 'lodash';

const CustomSwiper = ({
                                                       containerClassName,
                                                       slides = [],
                                                       slidesPerView = 5,
                                                       spaceBetween = 32,
                                                       slideClassName,
                                                       paginationTopClassName = "top-[40%]",
                                                       onChange = () => {},
                                                       hideArrows = false,
                                                       hardIndex,
                                                       showFraction = false,
                                                       onResize,
                                                       isCollapsed = true,
                                                       showArrowsForCollapsed,
                                                   }) => {
    const swiperRef = useRef(null);
    const [isBeginning, updateIsBeginning] = useState(true);
    const [isEnd, updateIsEnd] = useState(false);
    const [visibleSlideIndex, setVisibleSlideIndex] = useState(1);

    const setSlide = useCallback((index) => {
        if (index === undefined || !swiperRef.current) return;
        swiperRef.current.slideTo(index);
    }, [hardIndex]);

    useEffect(() => {
        setSlide(hardIndex);
    }, [setSlide, hardIndex]);

    const onAfterResize = debounce(onResize || (() => {}), 300);

    return (
        <section
            className={classnames(
                containerClassName,
                "position-relative"
            )}
            onMouseDown={(event) => event.stopPropagation()}
        >
            <Swiper
                className="mx-4"
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onAfterInit={(swiper) => {
                    updateIsBeginning(swiper.isBeginning)
                    onResize && onResize()
                }}
                onSlidesLengthChange={(swiper) => {
                    updateIsEnd(!swiper.slides.length)
                }}
                onResize={(swiper) => {
                    updateIsEnd(swiper.isEnd)
                    updateIsBeginning(swiper.isBeginning)

                    onAfterResize()
                }}
                onReachEnd={() => {
                    updateIsEnd(true)
                }}
                onTouchEnd={(swiper) => {
                    onChange(swiper)
                }}
                resizeObserver={true}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                onSlideChange={(swiper) => {
                    onChange(swiper)
                    updateIsEnd(swiper.isEnd)
                    updateIsBeginning(swiper.isBeginning)
                    setVisibleSlideIndex(swiper.realIndex + 1)
                }}
                onClick={(swiper) => {
                    onChange(swiper)
                }}
            >
                {slides.map((slide, index) => {
                    return (
                        <SwiperSlide key={index} className={classnames("h-auto", slideClassName)}>
                            {slide}
                        </SwiperSlide>
                    )
                })}
            </Swiper>

            {((!hideArrows || !isBeginning || (isCollapsed && showArrowsForCollapsed))) &&
                <button
                    type="button"
                    className={classnames(
                        "btn-arrow",
                        classes.BtnArrow,
                        classes.BtnArrowLeft,
                        paginationTopClassName,
                        isBeginning && "d-none"
                    )}
                    onClick={() => {
                        swiperRef.current?.slidePrev();
                    }}
                    disabled={isBeginning}
                >
                    <Icon
                        icon="arrowDown"
                        style={{
                            transform: "rotate(90deg)"
                        }}
                    />
                </button>
            }
            {(!hideArrows || !isEnd || (isCollapsed && showArrowsForCollapsed)) && (slidesPerView === "auto" ? true : slides.length > slidesPerView) &&
                <button
                    type="button"
                    className={classnames(
                        "btn-arrow",
                        classes.BtnArrow,
                        classes.BtnArrowRight,
                        paginationTopClassName,
                        isEnd && "d-none"
                    )}

                    onClick={() => {
                        swiperRef.current?.slideNext();
                    }}
                >
                    <Icon
                        icon="arrowDown"
                        style={{
                            transform: "rotate(-90deg)"
                        }}
                    />
                </button>
            }

            {showFraction && <div className="flex justify-center items-center w-full text-gray-400">
                <span className="text-black">{visibleSlideIndex}</span>
                <span className="text-gray-400 text-sm">/{slides.length}</span>
            </div>}

        </section>
    )

}

export default CustomSwiper;
