import Loading from '@/components/loader/Loading'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const Profile = lazy(() => import("../components/Profile"))
const Compiler = lazy(() => import("../pages/Compiler"))
const NotFound = lazy(() => import("../pages/NotFound"))

function AllRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/compiler/:postId?" element={<Compiler />} />
                <Route path="*" element={<NotFound name={""} />} />
            </Routes>
        </Suspense>
    )
}

export default AllRoutes