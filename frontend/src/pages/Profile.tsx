import { useState, ChangeEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateCurrentUser, updateLoggedInUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
    const [imagePreview, setImagePreview] = useState<string>("");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    const userAvatar = useSelector((state: RootState) => state.authSlice.currentUser?.avatar)
    const dispatch = useDispatch()

    const getCurrentUser = async () => {
        try {
            const response = await fetch("http://localhost:8000/api/v1/users/current-user",{
                method: "GET",
                credentials: "include"
            });
            const result = await response.json();
            console.log("current user is: ", result);
            if(response.ok) {
                dispatch(updateLoggedInUser(true));
                dispatch(updateCurrentUser(result?.data));
            } else {
                dispatch(updateLoggedInUser(false))
                throw result.message
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleAvatar = async () => {
        try {

            if(!avatarFile) {
                toast.error('Please select an image');
                return;
            }

            setLoading(true);
            const fileData = new FormData();
            fileData.append("avatar", avatarFile);

            const response = await fetch("http://localhost:8000/api/v1/users/update-avatar",{
                method: "PATCH",
                credentials: "include",
                body: fileData
            })

            const result = await response.json()

            if(response.ok){
                setLoading(false)
                getCurrentUser();
                toast.success(`Profile picture updated successfully`);
            } else {
                toast.error(result?.message)
            }
        } catch (error) {
            console.log("Avatar update ka error: ", error)
        }
    }

    // Function to handle file input change
    const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0]; // Get the selected file
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader(); // Create a FileReader object
            reader.onloadend = () => {
                setImagePreview(reader.result as string); // Set the image preview URL
            };
            reader.readAsDataURL(file); // Read the file as a data URL
        }
    };

    return (
        <div className="w-full px-64 pt-10 select-none">
            <div>
                <h1 className="text-6xl font-extrabold">Edit Profile</h1>
                <p className="text-xl">
                    Update your profile information. Changes will be reflected across the
                    platform.
                </p>
            </div>

            <div className="flex items-center space-x-44 py-10 border-b-2">
                <Label className="text-3xl font-bold" htmlFor="avatar">
                    Avatar
                </Label>
                <div className="flex items-center space-x-4">
                    <div className="relative rounded-full overflow-hidden w-[100px] h-[100px]">
                        {/* Display image preview */}
                        {imagePreview ? (
                            <img
                                alt="Image Preview"
                                className="object-cover w-full h-full"
                                src={imagePreview}
                            />
                        ) : (
                            <img
                                alt="Image Preview"
                                className="object-cover w-full h-full"
                                src={userAvatar}
                            />
                        )}
                        <Input
                            id="fileInput"
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            type="file"
                            onChange={handleFileInputChange} // Call handleFileInputChange on file input change
                        />
                    </div>

                    <div className="flex flex-col">
                        <Button onClick={handleAvatar}>
                            {!loading ? <>Upload</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Uploading</span>}
                        </Button>
                    </div>
                </div>
            </div>

            <div className="py-10 space-y-3 border-b-2">
                <h1 className="text-3xl font-bold">Username and email</h1>
                <div className="flex space-x-24">
                    <div className="space-y-2">
                        <Label htmlFor="username">Username :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="username"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                        />
                    </div>
                </div>
                <div>
                    <Button>Update</Button>
                </div>
            </div>

            <div className="py-10 space-y-3">
                <h1 className="text-3xl font-bold">Change Password</h1>
                <div className="space-y-2">
                    <Label htmlFor="old-password">Old Password :</Label>
                    <Input
                        className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                        id="old-password"
                        placeholder="Enter your old password"
                        type="password"
                    />
                </div>
                <div className=" flex space-x-24">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="password"
                            placeholder="Enter your new password"
                            type="password"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Confirm New Password :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="new-password"
                            placeholder="Confirm your new password"
                            type="password"
                        />
                    </div>
                </div>
                <div>
                    <Button>Change password</Button>
                </div>
            </div>
        </div>
    );
}
