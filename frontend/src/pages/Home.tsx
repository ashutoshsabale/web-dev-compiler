import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import "./styles/grid-bg.css"
import PostCard from "@/components/AllCodePosts";

const Home = () => {
    const navigate = useNavigate()
    return (
            <div className="w-full grid-bg text-white">
                <div className="flex justify-center items-center flex-col gap-3 h-[calc(100dvh-60px)]">
                    <h1 className="text-6xl font-extrabold text-center">The Web. Now. Yours.</h1>
                    <p className=" text-gray-500 text-center text-lg my-3">
                        Compiler HTML, CSS, JavaScript Code on the go and share it with your
                        friends
                    </p>
                    <Button onClick={() => navigate("/compiler")}>Get Started</Button>
                    <div><ArrowDownIcon height={25} width={30} className="mt-10 font-extrabold animate-bounce" /></div>
                    <div className="w-full h-[130px] bg-gradient-to-b from-transparent to-black absolute bottom-0 left-0"></div>
                </div>
                <PostCard />
            </div>

    );
}

export default Home