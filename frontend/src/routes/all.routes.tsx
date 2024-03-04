import Loading from '@/components/loader/Loading'
import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))
const UserCodesPage = lazy(() => import("../pages/UserCodes"))
const Compiler = lazy(() => import("../pages/Compiler"))
const NotFound = lazy(() => import("../pages/NotFound"))
const Profile = lazy(() => import("../pages/Profile"))

function AllRoutes() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/my-codes/:username" element={<UserCodesPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/compiler/:postId?" element={<Compiler />} />
                <Route path="*" element={<NotFound name={""} />} />
            </Routes>
        </Suspense>
    )
}

export default AllRoutes