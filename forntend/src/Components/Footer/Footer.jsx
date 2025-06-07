import Logo from "../Logo";
import { FaFacebookF } from "react-icons/fa"
import { FaInstagramSquare } from "react-icons/fa"
import { FaTwitter } from "react-icons/fa"
import { FaYoutube } from "react-icons/fa"
import SocialMediaBtn from "./SocialMediaBtn";

export default function Footer(){
    return(
        <div className="w-full bg-[#fcfafa]  flex flex-col justify-center items-center py-10">
            <div
            className="w-[80%] flex flex-wrap gap-x-5 text-gray-800 font-extrabold text-xs md:text-sm justify-center md:justify-between 
            items-center border-b-2 border-[#d8d4d4]"
            >
                <div className="w-[200px] p-4">
                    <Logo className={'w-full'}/>
                </div>
                <div className="w-[200px] p-4 text-center">
                    <p>WEEBLY THEMES</p>
                    <p>PRE-SALE FAOS</p>
                    <p>SUBMIT A TICKET</p>
                </div>
                <div className='w-[200px] p-4 text-center'>
                    <p>SERVICES</p>
                    <p>SUPPORT</p>
                </div>
                <div className="w-[200px] p-4 text-center">
                    <p>ABOUT US</p>
                    <p>CONTACT US</p>
                    <p>AFFILIATES</p>
                    <p>RESOURCES</p>
                </div>
            </div>
            <div className="flex flex-col gap-y-2 py-8 items-center">
                <div className="flex gap-x-2">
                    <SocialMediaBtn>
                        <FaFacebookF/>
                    </SocialMediaBtn>
                    <SocialMediaBtn>
                        <FaInstagramSquare/>
                    </SocialMediaBtn>
                    <SocialMediaBtn>
                        <FaTwitter/>
                    </SocialMediaBtn>
                    <SocialMediaBtn>
                        <FaYoutube/>
                    </SocialMediaBtn>
                </div>
                <div>
                    <p className="text-center font-[300] text-sm">
                        <span className="font-[400]">Copyright©2024;</span>
                        Designed by SAURAV
                    </p>
                </div>
            </div>
        </div>
    )
}