import { User, AtSign, FileText, Loader2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

interface UserTypeI {
    username: string;
    email: string;
    avatar: string;
    _id: string;
}

const UserCodesPage = () => {
    const {currentUser, isLoggedIn} = useSelector((state: RootState) => state.authSlice)
    const [savedCodeList, setSavedCodeList] = useState<{ template: string, title: string, description: string, _id: string }[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [deleteLoaders, setDeleteLoaders] = useState<{ [key: string]: boolean }>({});
    const navigate = useNavigate()
    const { username } = useParams()

    const [otherUser] = useState<boolean>(username === currentUser?.username ? false : true);
    const [requestedUser, setRequestedUser] = useState<UserTypeI | undefined>(undefined)

    const handleDeleteCode = async (codeId: string) => {
        try {
            setDeleteLoaders(prevState => ({ ...prevState, [codeId]: true }));
            const response = await fetch("http://localhost:8000/api/v1/compiler/delete-code", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: codeId }),
                credentials: "include"
            });

            if (response.ok) {
                fetchSavedCodes();
                toast.success("Code deleted successfully.");
            } else {
                const result = await response.json();
                toast.error(`Error deleting code: ${result.message}`);
            }
        } catch (error) {
            console.error("Error deleting code:", error);
            toast.error("An error occurred while deleting the code.");
        } finally {
            setDeleteLoaders(prevState => ({ ...prevState, [codeId]: false }));
        }
    };

    const fetchRequestedUser = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/v1/users/get-user/${username}`)

            const result = await response.json()

            if (response.ok) {
                console.log(result)
                setRequestedUser(result.data);
                console.log("Rquested user is: ", requestedUser)
            }
        } catch (error) {
            console.log("USer fetch ka error");
        }
    }

    const fetchSavedCodes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:8000/api/v1/compiler/fetch-code/${username}`, {
                method: "GET",
                credentials: "include"
            })

            const result = await response.json()

            if (response.ok) {
                setLoading(false)
                console.log(result)
                setSavedCodeList(result.data);
            }
        } catch (error) {
            console.log("fetch ka error");
        }
    }

    useEffect(() => {
        fetchSavedCodes()
        if (otherUser) fetchRequestedUser()
    }, [])

    return (
        <div className="w-full py-4 px-24 md:px-8 lg:px-36 xl:px-72">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 border-b pb-6 mb-6 px-10">
                <div className="text-3xl md:text-4xl lg:text-6xl font-extrabold">
                    {!otherUser ? "My Posts" : (
                        <div>
                            <h1>Welcome.</h1>
                            <p className='text-sm font-normal'>{`to ${username}'s personalized profile page. `}</p>
                        </div>
                    )}
                </div>
                <div className='flex flex-col md:flex-row gap-6'>
                    {(currentUser?.avatar || requestedUser?.avatar) ? (
                        <div className='flex justify-center items-center'>
                            <img src={otherUser ? requestedUser?.avatar : currentUser?.avatar} alt="" className="h-24 w-24 md:h-36 md:w-36 rounded-full select-none object-cover" />
                        </div>
                    ) : (
                        <User className="w-12 h-12 md:w-24 md:h-24 text-indigo-500" />
                    )}
                    <div className='flex flex-col gap-2'>
                        <h2 className="text-white text-xl md:text-3xl font-extrabold">{(otherUser ? requestedUser?.username : currentUser?.username) || "Username"}</h2>
                        <p className="text-gray-500 flex items-center"><AtSign className="w-4 h-4 mr-2" />{(otherUser ? requestedUser?.email : currentUser?.email) || "email"}</p>
                        <p className="text-gray-500 flex items-center"><FileText className="w-4 h-4 mr-2" />Posts: {savedCodeList.length}</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-wrap px-5 gap-6'>
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {/* Skeleton loaders */}
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                                <Skeleton className="h-48 md:h-60 w-full md:w-[440px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full md:w-[350px]" />
                                    <Skeleton className="h-4 w-full md:w-48" />
                                </div>
                                <div className='flex gap-5 w-full justify-center'>
                                    <Skeleton className="h-8 w-full md:w-[100px]" />
                                    <Skeleton className="h-8 w-full md:w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    savedCodeList && savedCodeList.map((item, i) => (
                        <div key={i} className="bg-gray-900 shadow-2xl rounded-lg p-4 pb-3 flex flex-col justify-center items-center w-full md:w-[440px] gap-3">
                            <div>
                                <img src={item?.template} alt="template" className='w-full md:w-[400px] h-[250px] object-cover rounded-md' />
                            </div>
                            <div className='flex flex-col w-full gap-2'>
                                <div className='border-b-2 pb-1'>
                                    <p><span className='font-bold text-lg'>Title: </span>{item.title}</p>
                                    <p><span className='font-bold'>Description: </span>{item.description}</p>
                                </div>
                                {otherUser ? (
                                    <Button onClick={() => isLoggedIn ? navigate(`/compiler/${item._id}`) : toast.message("Please do Login to access the source code.")}>Source Code</Button>
                                ) : (
                                    <div className='flex justify-center items-center gap-5'>
                                        <Button onClick={() => navigate(`/compiler/${item._id}`)} variant="default">Edit Project</Button>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDeleteCode(item._id)}
                                            disabled={deleteLoaders[item._id]}
                                        >
                                            {deleteLoaders[item._id] ? (
                                                <>
                                                    <Loader2 className='animate-spin' /> Deleting
                                                </>
                                            ) : (
                                                <span className='gap-1 flex justify-center items-center'>Delete <Trash2 size={16} /></span>
                                            )}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserCodesPage;
