import { range } from "lib/util";
import React from "react";

import style from "./Carousel.scss";

export type Props = {
    selected: number;
    children: JSX.Element[];
    alignItems?: string;
};

export default function Carousel(props: Props): JSX.Element {
    const alignItems = props.alignItems || "center";

    return (
        <div className={style.carouselView}>
            {range(props.children.length).map((i) => {
                const xOffsetMultiple = i - props.selected;
                const elementStyle = {
                    alignItems,
                    transform: `translateX(${xOffsetMultiple * 100}%)`,
                };
                const c = props.children[i];
                return (
                    <div key={i} className={style.elementContainer} style={elementStyle}>
                        {c}
                    </div>
                );
            })}
        </div>
    );
}
