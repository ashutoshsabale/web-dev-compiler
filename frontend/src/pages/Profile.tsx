import { useState, ChangeEvent, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2Icon, Mail, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { updateCurrentUser, updateLoggedInUser } from "@/store/slices/authSlice";

export default function ProfilePage() {
    const [imagePreview, setImagePreview] = useState<string>("");
    const [username, setUsername] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarLoading, setAvatarLoading] = useState<boolean>(false)
    const [userUpdateLoading, setUserUpdateLoading] = useState<boolean>(false)
    const [changePassLoading, setChangePassLoading] = useState<boolean>(false)
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

    const userAvatar = useSelector((state: RootState) => state.authSlice.currentUser?.avatar)
    const userUsername = useSelector((state: RootState) => state.authSlice.currentUser?.username)
    const userEmail = useSelector((state: RootState) => state.authSlice.currentUser?.email)

    const dispatch = useDispatch()

    useEffect(()=>{
        getCurrentUser()
    },[])

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
                // setUsername(result?.data.username)
                // setEmail(result?.data.email)
                console.log("User fetched")
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

            setAvatarLoading(true);
            const fileData = new FormData();
            fileData.append("avatar", avatarFile);

            const response = await fetch("http://localhost:8000/api/v1/users/update-avatar",{
                method: "PATCH",
                credentials: "include",
                body: fileData
            })

            const result = await response.json()

            if(response.ok){
                setAvatarLoading(false)
                getCurrentUser();
                toast.success(`Profile picture updated successfully`);
            } else {
                toast.error(result?.message)
            }
        } catch (error) {
            console.log("Avatar update ka error: ", error)
        }  finally {
            setAvatarLoading(false)
        }
    }

    const handleUsernameEmailUpdate = async () => {
        try {
            setUserUpdateLoading(true)
            const resposne = await fetch("http://localhost:8000/api/v1/users/update-account",{
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, email}),
                credentials: "include"
            })

            const result = await resposne.json();

            if(resposne.ok){
                setUserUpdateLoading(false);
                toast.success("Username and password updated successfully")
                getCurrentUser();
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            console.log("Username or email updation ka error")
        } finally {
            setUserUpdateLoading(false)
        }
    }

    const handleChangePassword = async () => {
        try {
            setChangePassLoading(true);
            if(oldPassword === "" || newPassword === "" || confirmNewPassword ===""){
                toast.warning("All fields are required");
                return
            }

            if (newPassword !== confirmNewPassword) {
                toast.error("New passwords do not match");
                return;
            }

            const response = await fetch("http://localhost:8000/api/v1/users/change-current-password", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldPassword, newPassword }),
                credentials: "include"
            });

            const result = await response.json();
            if (response.ok) {
                setChangePassLoading(false);
                toast.success("Password changed successfully");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            console.log("Error changing password:", error);
        } finally {
            setChangePassLoading(false);
        }
    };

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
                <div className="flex gap-10 pt-3 text-gray-600">
                    <p className="flex items-center gap-1"><User size={16}/> {userUsername}</p>
                    <p className="flex items-center gap-1"><Mail size={16}/> {userEmail}</p>
                </div>
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
                            {!avatarLoading ? <>Upload</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Uploading</span>}
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
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="email"
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <Button onClick={handleUsernameEmailUpdate}>
                        {!userUpdateLoading ? <>Update</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Updating</span>}
                    </Button>
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
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
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
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">Confirm New Password :</Label>
                        <Input
                            className="dark:bg-gray-800 dark:text-gray-50 w-[250px]"
                            id="new-password"
                            placeholder="Confirm your new password"
                            type="password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div>
                    <Button onClick={handleChangePassword}>
                        {!changePassLoading ? <>Change password</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Changing Password</span>}
                    </Button>
                </div>
            </div>
        </div>
    );
}
