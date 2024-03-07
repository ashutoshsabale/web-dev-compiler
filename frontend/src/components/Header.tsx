import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Dropdown from "./Dropdown";
import webDevCompilerLogo from "../assets/webDevCompilerLogo.png";

function Header() {
    const { isLoggedIn } = useSelector((state: RootState) => state.authSlice);

    return (
        <nav className="w-full h-[60px] bg-gray-900 text-white px-10 flex justify-between items-center">
            <Link to="/" className="flex justify-center items-center relative">
                <img src={webDevCompilerLogo} className="w-[55px] h-[55px]" alt="Web Dev Compiler Logo" /> <span className=" absolute left-[40px] bottom-[-1px]    text-9xl text-red-400">.</span>
            </Link>
            <ul className="flex gap-3">
                <li>
                    <Link to="/compiler">
                        <Button variant="secondary">
                            Compiler
                        </Button>
                    </Link>
                </li>
                {!isLoggedIn ? (
                    <>
                        <li>
                            <Link to="/login">
                                <Button variant="secondary">
                                    Log In
                                </Button>
                            </Link>
                        </li>
                        <li>
                            <Link to="/register">
                                <Button variant="secondary">
                                    Sign Up
                                </Button>
                            </Link>
                        </li>
                    </>
                ) : (
                    <Dropdown />
                )}
            </ul>
        </nav>
    );
}

export default Header;
