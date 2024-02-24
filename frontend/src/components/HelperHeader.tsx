import { Share1Icon, FileTextIcon, PieChartIcon, CodeIcon, CopyIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select"
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
DialogTrigger,
} from "@/components/ui/dialog"

import { useDispatch, useSelector } from "react-redux";
import { CompilerSliceStateType, updateCurrentLanguage } from "@/store/slices/compilerSlice";
import { RootState } from "@/store/store";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";



function HelperHeader() {
    const dispatch = useDispatch();
    const defaultLanguage = useSelector((state: RootState) => state.compilerSlice.currentLanguage)
    const fullcode = useSelector((state: RootState) => state.compilerSlice.fullCode)
    const navigate = useNavigate()

    const { postId } = useParams();

    const [saveLoading, setSaveLoading] = useState<boolean>(false);

    const handleSave = async () => {
        try {
            setSaveLoading(true);
            const data = { fullcode, title: "second code"}
            const response = await fetch("http://localhost:8000/api/v1/compiler/save-code",{
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            console.log(result);

            if(!response.ok) {
                console.log(result.error)
                toast.error('Error while saving code please try again')
            }

            if(response.ok) {
                navigate(`/compiler/${result.data._id}`, {replace: true})
                setSaveLoading(false);
                toast.success('Code saved successfully')
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while trying to connect to server.")
        } finally {
            setSaveLoading(false);
        }

    }

    return (
        <div className="__helper_header flex justify-between h-[50px] gap-3 bg-black text-white p-2">
            <div className="__btn_container flex gap-2">
                <Button
                    className="flex justify-center items-center gap-1"
                    variant="success"
                    size="sm"
                    onClick={handleSave}
                >
                    {!saveLoading ? <><FileTextIcon />
                    Save</> : <><PieChartIcon className="animate-spin" /> Saving...</>}
                </Button>

                {postId &&
                <Dialog>
                    <DialogTrigger className="whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 rounded-md px-3 text-xs flex justify-center items-center gap-1"><Share1Icon />{" "} Share</DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex justify-center gap-2 items-center mb-2">
                                <CodeIcon height={25} width={25}/>Share your code!
                            </DialogTitle>
                            <DialogDescription className="text-center">
                                <div className="flex justify-center gap-1">
                                    <input
                                        type="text"
                                        disabled
                                        value={window.location.href}
                                        className=" w-full disable p-2 text-center rounded bg-slate-800 mb-2"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                                navigator.clipboard.writeText(window.location.href)
                                                toast.success("Copied link to clipboard")
                                            }
                                        }
                                    >
                                        <CopyIcon />
                                    </Button>
                                </div>
                                Share this link with others to collaborate.
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>}
            </div>

            <div className="__tab_switcher flex items-center gap-1">
                <small>Current Language:</small>
                <Select
                    defaultValue={defaultLanguage}
                    onValueChange={value => dispatch(updateCurrentLanguage(value as CompilerSliceStateType["currentLanguage"]))}
                >
                    <SelectTrigger className="w-[120px] bg-gray-800 outline-none focus:ring-0">
                        <SelectValue placeholder="HTML" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="html">HTML</SelectItem>
                        <SelectItem value="css">CSS</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                </Select>
            </div>

        </div>
    );
}

export default HelperHeader;
