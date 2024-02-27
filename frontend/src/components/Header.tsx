import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Dropdown from "./Dropdown";

function Header() {
    const {isLoggedIn} = useSelector((state: RootState) => state.authSlice)
    // console.log("isLoggedIn: ", isLoggedIn);
    return (
        <nav className="w-full h-[60px] bg-gray-900 text-white px-10 flex justify-between items-center">
            <Link to="/">
                <h2 className="font-bold select-none">WD Compiler</h2>
            </Link>
            <ul className="flex gap-3">
                <li>
                    <Link to="/compiler">
                        <Button variant="secondary">
                            Compiler
                        </Button>
                    </Link>
                </li>
                {!isLoggedIn ?
                    (<>
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
                    </>) : (
                        <Dropdown />
                    )
                }
            </ul>
        </nav>
  );
}

export default Header;
