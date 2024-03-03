import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

export default function PostCard() {
    return (
        <div className="bg-black">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>
                        <div className="flex items-center gap-3">
                            <span >
                                <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                                    <AvatarImage className="object-cover w-full h-full" src="https://cdn.pixabay.com/photo/2019/07/16/18/18/frontend-4342425_1280.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </span>
                            <div className="space-y-1">
                                <p>username</p>
                                <p>email</p>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <img src="https://cdn.pixabay.com/photo/2019/07/16/18/18/frontend-4342425_1280.png" alt="template" className='w-full h-[200px] object-cover rounded-md mb-2' />
                    </div>
                    <CardDescription className="text-white font-bold">Project title</CardDescription>
                    <CardDescription className="text-ellipsis overflow-hidden whitespace-nowrap">project ka decription ayega ihdar Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis autem maxime a vero et dolor veniam explicabo neque at quibusdam. At ipsum, distinctio ex earum totam, odit soluta porro possimus numquam neque nisi cupiditate minus non quaerat sit placeat alias aspernatur! Ipsam quidem incidunt iusto atque eveniet accusantium esse? Laboriosam quisquam, consectetur vel quibusdam explicabo ex molestiae nulla. Debitis hic commodi quam modi sequi consectetur tenetur perferendis vero recusandae nemo. Harum itaque numquam impedit perspiciatis aliquid cum ratione, veritatis animi soluta molestias, libero quas optio possimus a et dolores, dicta omnis similique. Quia, ullam rem doloremque earum consectetur sapiente molestias!</CardDescription>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button>Source Code</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
