import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import "./style.css"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import Loading from "./loader/Loading"
import { useNavigate } from "react-router-dom"

interface User {
    _id: string;
    email: string;
    avatar: string;
}


export default function PostCard() {
    const [allCodes, setAllCodes] = useState<{ template: string, title: string, description: string, _id: string, ownerId: string, ownerName: string, createdAt: string }[]>([])
    const [allUsers, SetAllUsers] = useState<{ avatar: string, email: string, _id: string }[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const navigate = useNavigate()

    const userEmail = (userId: string | undefined, allUsers: User[] | undefined): string => {
        const user = allUsers?.find(user => user._id === userId);
        if (!user) return "";
        return user.email;
    };

    const userAvatar = (userId: string | undefined, allUsers: User[] | undefined): string => {
        const user = allUsers?.find(user => user._id === userId);
        if (!user) return "";
        return user.avatar;
    };

    const getAllUsers = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/all-users")
            const result = await response.json()

            if (response.ok) {
                SetAllUsers(result.data)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log("All users fethcing ka error")
        }
    }

    const getAllCodes = async () => {
        try {
            setLoading(true)
            const response = await fetch("http://localhost:8000/api/v1/compiler/all-codes")
            const result = await response.json()

            if (response.ok) {
                setLoading(false)
                setAllCodes(result.data)
                setLoading(false)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log("All codes fethcing ka error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getAllCodes();
        getAllUsers();
    }, [])

    console.log("Users are: ", allUsers)
    console.log("Codes are: ", allCodes)

    return (
        <div className="bg-texture py-20 px-36">
            <h1 className="text-6xl pb-8 font-extrabold ">Explore Ideas</h1>
            <div className="flex flex-wrap gap-y-8 gap-x-4">
                {(!loading && allCodes && allUsers) ? (
                    allCodes.map((codePost) => (
                        <Card className="w-[400px]" key={codePost._id}>
                            <CardHeader>
                                <CardTitle className="cursor-pointer" onClick={() => navigate(`/my-codes/${codePost.ownerName}`)}>
                                    <div className="flex items-center gap-3">
                                        <span >
                                            <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                                <AvatarImage className="object-cover w-full h-full" src={userAvatar(codePost.ownerId, allUsers)} />
                                                <AvatarFallback>{codePost.ownerName.slice(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                        </span>
                                        <div className="space-y-1">
                                            <p>{codePost.ownerName}</p>
                                            <p className="font-normal text-gray-500">{userEmail(codePost.ownerId, allUsers)}</p>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-3">
                                <div>
                                    <img src={codePost.template} alt="template" className='w-full h-[200px] object-cover rounded-md mb-2' />
                                </div>
                                <CardDescription className="text-white font-bold">{codePost.title}</CardDescription>
                                <CardDescription className="text-ellipsis overflow-hidden whitespace-nowrap">{codePost.description}</CardDescription>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button onClick={() => navigate(`/compiler/${codePost._id}`)}>Source Code</Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <Loading />
                )}
            </div>
        </div>

    )
}
