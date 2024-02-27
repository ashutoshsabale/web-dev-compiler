import "./styles/grid-bg.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PieChartIcon } from "@radix-ui/react-icons";
import { useState } from "react";

// const MAX_FILE_SIZE = 5 * 1024 * 1024;
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
    username: z.string().min(4, {
        message: "Username must be at least 2 characters.",
    }),
    email: z.string().email("Invalid email address."),
    password: z.string(),
    avatar: z.instanceof(File),
});

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [file, setFile] = useState<File | undefined>();

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            avatar: new File([], ""),
        },
    });

    // 2. Define a submit handler.
    async function handleRegister(values: z.infer<typeof formSchema>) {

        // When you formdata dont mention content-type while fetch let browser decide it
        // and also when you handling with file mention encType="multipart/form-data"

        const formData = new FormData();
        formData.append('username', values.username);
        formData.append('password', values.password);
        formData.append('email', values.email);
        if (file) formData.append('avatar', file);

        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/v1/users/register", {
                method: "POST",
                body: formData // Let browser set Content-Type
            });

            const result = await response.json();
            console.log(result);
            if (response.ok) {
                setLoading(false);
                toast.success("User registered successfully");
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setFile(file);
            form.setValue('avatar', file);
        }
    };

    return (
        <div className='w-full grid-bg h-[calc(100dvh-60px)] flex justify-center items-center'>
            <div className="w-[30%] border backdrop-blur-[1px] py-8 px-3 flex flex-col justify-center items-center rounded-2xl">
                <h1 className="text-4xl font-bold mb-3">Sign Up</h1>
                <p className="text-2xl mb-2">Sign up to create account</p>
                <div className="w-[70%]">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-4" encType="multipart/form-data">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Avatar</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                placeholder="Upload Avatar"
                                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                                onChange={handleFileChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter your username"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your username"
                                                required
                                                {...field}
                                            />
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
                                            <Input
                                                required
                                                placeholder="Enter your password" type="password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="w-full flex items-center justify-center ">
                                <Button type="submit" className="w-[50%] flex gap-1">
                                    {!loading ? <>Sign up</> : <><PieChartIcon className="animate-spin " /> Signing up</>}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="mt-5 text-center text-base text-white">
                        Already have an account?&nbsp;
                        <Link
                            to="/login"
                            className="font-medium text-blue-500 transition-all duration-200 hover:underline"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register;
