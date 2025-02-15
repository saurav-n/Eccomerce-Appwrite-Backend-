import Button from "../Components/Button";
import Container from "../Components/Container";
import { useNavigate } from "react-router";
import DisplayCart from "../Components/DisplayCart";
import { useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { LoadingContext } from "../app/Loadingcontext";
import { SkeletonCard } from "@/Components/SkeletonCard";
import {
    Accordion,
    AccordionItem,
    AccordionContent,
    AccordionTrigger
} from "@/Components/accordion";
export default function Items() {
    const navigate = useNavigate()
    const items = useSelector(state => state.item.items)
    const [featuredItem, setFeaturedItem] = useState([]);
    console.log(items)
    const { isAppLoading } = useContext(LoadingContext)
    useEffect(() => {
        if (items) setFeaturedItem(items.filter(item => item.isFeatured))
    }, [isAppLoading, items])

    const faqs = [
        {
            question: 'Is quality guaranteed?',
            ans: 'We take pride in offering only the highest quality products curated from trusted suppliers. Every item in our inventory undergoes rigorous quality checks to ensure your satisfaction.'
        },
        {
            question: 'Can we expect secure shopping expirience?',
            ans: 'Your privacy and security are of utmost importance to us. Shop with confidence knowing that your personal information is protected by advanced encryption technology.'
        },
        {
            question: "Do you provide variations for unbeatable selection?",
            ans: 'From trendy fashion essentials to cutting-edge gadgets and everything in between, we have something for everyone.'
        },
        {
            question: 'What is the shipping policy?',
            ans: "Say goodbye to long wait times. We know you're eager to receive your purchases, which is why we prioritize fast and reliable shipping."
        }
    ]

    return (
        <Container>
            <div className="w-full flex flex-col items-center  py-4 gap-y-8">
                {/* hero section */}
                <div className="flex flex-col gap-y-2 md:flex-row md:gap-x-5 md:w-full md:max-w-[1000px] md:justify-between px-2">
                    <div className="overflow-hidden w-full max-w-[400px] h-[300px] md:order-2">
                        <img src="/image/heroImg.jpg" alt="hero img" className="" />
                    </div>
                    <div className="flex flex-col gap-y-1 w-full max-w-[400px]">
                        <h1 className="text-3xl font-bold  text-gray-800">
                            Welcome to the <span className="text-blue-500">Shop</span>
                        </h1>
                        <p className="text-lg text-gray-500">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                            Quia eveniet vel nostrum tempora voluptatibus, atque incidunt suscipit,
                            eos, ut provident omnis natus
                        </p>
                        <Button
                            text='Shop Now'
                            className="max-w-[150px]"
                            onClick={() => navigate('/product')}
                        />
                    </div>
                </div>
                {/* end of hero section */}
                {/* featured products */}
                <div className="flex flex-col gap-y-2 items-center w-full bg-[#fcfafa] py-2 px-2">
                    <h1 className="text-3xl font-bold  text-gray-800">
                        Our Featured <span className="text-blue-500">Products</span>
                    </h1>
                    <div className="flex gap-x-4 gap-y-2 flex-wrap w-full justify-center">
                        {
                            isAppLoading ? (
                                <>
                                    <SkeletonCard />
                                    <SkeletonCard />
                                    <SkeletonCard />
                                </>
                            ) :

                                featuredItem.map(item => <DisplayCart key={item.$id} item={item} />)
                        }
                    </div>
                </div>
                {/* end of featured products */}
                {/* faqs */}
                <div className="w-full p-2 flex flex-col gap-y-2 items-center">
                    <h1 className="text-3xl font-bold  text-gray-800">
                        FAQ<span className="text-blue-500">s</span>
                    </h1>
                    <div className="transition-all duration-500 ease-in-out">
                        {
                            faqs.map((faq,index) => (
                                <Accordion key={index} type="single" collapsible>
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                                        <AccordionContent>
                                            {faq.ans}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>

                            ))
                        }
                    </div>
                </div>
            </div>
        </Container>
    )
}