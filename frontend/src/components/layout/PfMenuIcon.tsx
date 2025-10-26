import React from "react";

export default function PfMenuIcon ( {item}:{item:any} )  {

    let isSelected =  location.pathname === item?.path;
    let classesSelectedOrNotCss = isSelected ? " text-primary font-medium " : " "
    let classesOnHover = " w-8 h-8 transition-colors text-xl" +
        // "hover:-translate-y-1 transition-all hover:pb-1" +
        " rounded-full p-1 cursor-pointer " +
        " hover:border-solid hover:border-gray-400 " +
        " hover:border-1 hover:text-primary ";

    let allClasses = classesSelectedOrNotCss + classesOnHover;

    return (
        <>{ item && item.icon(allClasses) }
        </>
    )
}