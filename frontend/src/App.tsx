import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/Header.tsx"
import { Toaster } from "./components/ui/sonner.tsx"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { updateCurrentUser, updateLoggedInUser } from "./store/slices/authSlice.ts"
import AllRoutes from "./routes/all.routes.tsx"


function App() {
    const dispatch = useDispatch();

    const getCurrentUser = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/current-user",{
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            // console.log("current user is: ", result);
            if(response.ok) {
                dispatch(updateLoggedInUser(true));
                dispatch(updateCurrentUser(result.data));
            } else {
                dispatch(updateLoggedInUser(false))
                throw result.message
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=> {
        getCurrentUser();
    },[])

    return (
        <div className="w-[100dvw] h-[100dvh]">
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header />
                <AllRoutes />
                <Toaster />
            </ThemeProvider>
        </div>
    )
}

export default App
