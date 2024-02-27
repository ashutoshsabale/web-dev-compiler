import "./styles/grid-bg.css"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Link, useNavigate } from "react-router-dom"
import { PieChartIcon } from "@radix-ui/react-icons"
import { useState } from "react"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { updateCurrentUser, updateLoggedInUser } from "@/store/slices/authSlice"

const formSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string()
})

function Login() {
    const [loading, setLoading] = useState<boolean>(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: ""
        },
    })

    // 2. Define a submit handler.
    async function handleLogin(values: z.infer<typeof formSchema>) {
        console.log(values)
        try {
            setLoading(true)
            const response = await fetch("http://localhost:8000/api/v1/users/login",{
                method:"POST",
                credentials: "include",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(values)
            })

            const result = await response.json()
            // console.log("result : ", result);
            if (!response.ok){
                toast.error(result.message)
            }

            if(response.ok){
                setLoading(false)
                const {username, email, savedCodes, avatar} = result?.data?.user
                dispatch(updateCurrentUser({username, email, savedCodes, avatar}))
                dispatch(updateLoggedInUser(true))
                navigate("/compiler")
                toast.success("User logged in successfully!")
            }
        } catch (error) {
            console.log("Helo everyone",error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='w-full grid-bg h-[calc(100dvh-60px)] flex justify-center items-center'>
            <div className="w-[30%] border backdrop-blur-[1px] py-8 px-3 flex flex-col justify-center items-center rounded-2xl">
                <h1 className="text-4xl font-bold mb-3">Login</h1>
                <p className="text-2xl mb-2">Sign in to your account</p>
                <div className="w-[70%]">
                    <Form {...form} >
                        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your username or email" required {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input required placeholder="Enter your password" type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full flex items-center justify-center ">
                                <Button type="submit" className="w-[50%] flex gap-1">
                                    {!loading ? <>Log in</> : <><PieChartIcon className="animate-spin " /> Logging in</>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="text-center pt-7">
                        Don&apos;t have any account?&nbsp;
                        <Link
                            to='/register'
                            className="font-medium text-primary transition-all duration-200 hover:underline text-blue-500"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login