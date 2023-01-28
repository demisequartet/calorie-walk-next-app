import logo from "../../public/logo.png";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";

export default function Logo(){
    return (
        <header style={{display:'flex',width:'30%',margin:'0 auto'}}>
            <Image src={logo} alt="logo" height={150}/>
            <button style={{height:'50px'}}>
                <Link href="/">Topへ</Link>
            </button>
        </header>
    );    
}