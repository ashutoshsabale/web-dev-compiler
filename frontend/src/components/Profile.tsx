import { User, AtSign, FileText, Loader2, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const UserProfilePage = () => {
    const loggedInUser = useSelector((state: RootState) => state.authSlice.currentUser)
    const [savedCodeList, setSavedCodeList] = useState<{ template: string, title: string, description: string, _id: string }[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [deleteLoaders, setDeleteLoaders] = useState<{ [key: string]: boolean }>({});

    const navigate = useNavigate()

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

    const fetchSavedCodes = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:8000/api/v1/compiler/fetch-code", {
                method: "GET",
                credentials: "include"
            })

            const result = await response.json()

            if (response.ok) {
                setLoading(false)
                setSavedCodeList(result.data);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchSavedCodes()
    }, [])

    return (
        <div className="w-full h-full py-4 px-72">
            <div className="flex items-center justify-center space-x-24 pb-6 border-b mb-6">
                {
                    loggedInUser?.avatar ? (
                        <div>
                            <img src={loggedInUser.avatar} alt="" className="h-44 w-44 rounded-full select-none" />
                        </div>
                    ) : (
                        <User className="w-44 h-44 text-indigo-500" />
                    )
                }
                <div className='flex flex-col gap-2'>
                    <h2 className="text-white text-4xl font-semibold">{loggedInUser?.username || "Username"}</h2>
                    <p className="text-gray-500 flex items-center"><AtSign className="w-4 h-4 mr-2" />{loggedInUser?.email || "Email"}</p>
                    <p className="text-gray-500 flex items-center"><FileText className="w-4 h-4 mr-2" />Posts: {savedCodeList.length}</p>
                </div>
            </div>

            <div className='flex flex-wrap px-5 h-full justify-start gap-x-8 gap-y-6 w-full'>
                {loading ? (
                    <div className="grid grid-cols-2 gap-8 grid-flow-col">
                        {/* Skeleton loaders */}
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="flex flex-col space-y-3">
                                <Skeleton className="h-60 w-[440px] rounded-xl" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[350px]" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                                <div className='flex gap-5 w-full justify-center'>
                                    <Skeleton className="h-8 w-[100px]" />
                                    <Skeleton className="h-8 w-[100px]" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    savedCodeList && savedCodeList.map((item, i) => (
                        <div key={i} className="bg-gray-900 shadow-xl rounded-lg p-4 flex flex-col justify-center items-center w-[440px] gap-3">
                            <div>
                                <img src={item?.template} alt="template" className='w-[400px] rounded-md' />
                            </div>
                            <div className='flex flex-col w-full gap-2'>
                                <div className=''>
                                    <p><span className='font-bold'>Title : </span>{item.title}</p>
                                    <p><span className='font-bold'>Description : </span>{item.description}</p>
                                </div>
                                <div className='flex justify-center items-center gap-5'>
                                    <Button onClick={() => navigate(`/compiler/${item._id}`)}>Edit Project</Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => handleDeleteCode(item._id)}
                                        disabled={deleteLoaders[item._id]}
                                    >
                                        {deleteLoaders[item._id] ? (
                                            <>
                                                <Loader2 className='animate-spin'/> Deleting
                                            </>
                                        ) : (
                                            <span className='gap-1 flex justify-center items-center'>Delete <Trash2 size={16} /></span>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

            </div>
        </div>
    );
};

export default UserProfilePage;
