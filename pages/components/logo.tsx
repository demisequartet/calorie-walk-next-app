import vercel from "../../public/vercel.svg";
import React from "react";
import Image from "next/Image";

export default function Logo(){
    //最終的にGeoLunchのロゴに置き換える
    return (
        <>
            <Image src={vercel} alt="logo" width={500} height={500}/>
        </>
    )
    
}