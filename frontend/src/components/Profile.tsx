import { User, AtSign, FileText } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const UserProfilePage = () => {
    const loggedInUser = useSelector((state: RootState) => state.authSlice.currentUser)

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
                    <p className="text-gray-500 flex items-center"><FileText className="w-4 h-4 mr-2" />Posts: {loggedInUser?.savedCodes?.length}</p>
                </div>
            </div>

            <div className='flex flex-wrap px-5 h-full justify-start gap-x-3 gap-y-6 w-full'>
                <div className="bg-gray-800 shadow-xl rounded-lg p-6 h-56 w-[450px]">
                    Ashutosh Sabale
                </div>
                <div className="bg-gray-800 shadow-xl rounded-lg p-6 h-56 w-[450px]">
                    Ashutosh Sabale
                </div>

            </div>
        </div>
    );
};

export default UserProfilePage;