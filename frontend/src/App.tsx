import { Route, Routes } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "./components/Header.tsx"
import Home from "./pages/Home.tsx"
import Compiler from "./pages/Compiler.tsx"
import NotFound from "./pages/NotFound.tsx"

function App() {
    return (
        <>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Header />
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/compiler" element={<Compiler/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </ThemeProvider>
        </>
    )
}

export default App
