import { Share1Icon, CodeIcon, CopyIcon } from "@radix-ui/react-icons";
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
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Edit, ListCollapse, Loader2Icon, Save } from "lucide-react";

function HelperHeader() {
    const dispatch = useDispatch();
    const defaultLanguage = useSelector((state: RootState) => state.compilerSlice.currentLanguage)
    const fullCode = useSelector((state: RootState) => state.compilerSlice.fullCode)
    const navigate = useNavigate();

    const projectTitle = useSelector((state: RootState) => state.compilerSlice.title)
    const projectDescription = useSelector((state: RootState) => state.compilerSlice.description)
    const projectTemplate = useSelector((state: RootState) => state.compilerSlice.template)

    const { postId } = useParams();

    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [codeTitle, setCodeTitle] = useState<string>(postId! ? projectTitle : "");
    const [codeDescription, setCodeDescription] = useState<string>(!postId ? "" : projectDescription)
    const [templateFile, setTemplateFile] = useState<File | undefined>();
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)

    const isLoggedIn = useSelector((state: RootState) => state.authSlice.isLoggedIn);
    const currentUser = useSelector((state: RootState) => state.authSlice.currentUser);
    const [editAuthority] = useState<boolean>(currentUser?.savedCodes?.includes(postId!) ? true : false)

    console.log(currentUser)

    const handleEdit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Check if title or description is empty
        if (codeTitle.trim() === "") {
            toast.error("Please provide a title!");
            return;
        } else if (codeDescription.trim() === "") {
            toast.error("Please provide a description!");
            return;
        }

        try {
            setSaveLoading(true);
            const formData = new FormData();
            formData.append("title", codeTitle);
            formData.append("fullcode", JSON.stringify(fullCode));
            formData.append("description", codeDescription);

            if (templateFile) {
                formData.append("template", templateFile);
            }

            const response = await fetch(`http://localhost:8000/api/v1/compiler/edit-code/${postId}`, {
                method: "PATCH",
                credentials: "include",
                body: formData,
            });

            const result = await response.json();
            console.log("result is: ", result);

            if (response.ok) {
                setSaveLoading(false);
                setDialogOpen(false);
                toast.success('Code updated successfully');

            } else {
                toast.error('Error while updating code. Please try again.');
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong while trying to connect to the server.");
        } finally {
            setSaveLoading(false);
        }
    };


    const handleSave = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // check if title or description empty
        if (codeTitle.length === 0) {
            toast.error("Please provide title!")
            return null;
        } else if (codeDescription.length === 0) {
            toast.error("Please provide description!")
            return null;
        }

        try {
            setSaveLoading(true);
            const formData = new FormData();
            formData.append("title", codeTitle);
            formData.append("fullcode", JSON.stringify(fullCode));
            formData.append("description", codeDescription);

            if (templateFile) {
                formData.append("template", templateFile);
            }

            const response = await fetch("http://localhost:8000/api/v1/compiler/save-code", {
                method: "POST",
                body: formData,
                credentials: "include"
            })

            const result = await response.json()
            console.log("result is: ", result);

            if (!response.ok) {
                toast.error('Error while saving code please try again')
            }

            if (response.ok) {
                setSaveLoading(false);
                setDialogOpen(false)
                navigate(`/compiler/${result.data._id}`, { replace: true })
                setCodeTitle("")
                setCodeDescription("")
                toast.success('Code saved successfully')
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while trying to connect to server.")
        } finally {
            setSaveLoading(false);
        }

    }

    const handleSaveIfNotLoggedIn = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        toast.error("Please make sure you are logged in.")
    }

    const handleTemplateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setTemplateFile(file);
    }

    return (
        <div className="__helper_header flex justify-between h-[50px] gap-3 bg-black text-white p-2">
            <div className="__btn_container flex gap-2">

                {/* Edit and save button dialog */}
                {(postId && editAuthority) ? (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger className="whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-500 shadow hover:bg-green-600 h-8 rounded-md px-3 text-xs flex justify-center items-center gap-1">
                            <Edit size={16} />{" "} Edit
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex justify-center gap-2 items-center mb-2">
                                    Edit your project.
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <form onSubmit={handleEdit}>
                                        <div className="flex justify-center flex-col gap-4">
                                            <div className="space-y-1">
                                                <Label>Edit Title :</Label>
                                                <input
                                                    type="text"
                                                    value={codeTitle}
                                                    required
                                                    onChange={(e) => setCodeTitle(e.target.value)}
                                                    placeholder="Give name to your project..."
                                                    className=" w-full disable p-2 rounded bg-slate-800 mb-2"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label>Edit Description :</Label>
                                                <Textarea
                                                    value={codeDescription}
                                                    placeholder="Describe your project.."
                                                    className="h-24 bg-slate-800"
                                                    onChange={(e) => setCodeDescription(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label>Change template : </Label>
                                                <input
                                                    type="file"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-slate-800"
                                                    onChange={handleTemplateFile}
                                                />
                                            </div>

                                            <div className="flex justify-center items-center  w-full">
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="lg"
                                                    className="w-[150px] text-md"
                                                >
                                                    {!saveLoading ? <>Update</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Updating</span>}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger className="whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-green-500 shadow hover:bg-green-600 h-8 rounded-md px-3 text-xs flex justify-center items-center gap-1">
                            <Save size={16} />{" "} Save
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="flex justify-center gap-2 items-center mb-2">
                                    Save your project.
                                </DialogTitle>
                                <DialogDescription asChild>
                                    <form onSubmit={isLoggedIn ? handleSave : handleSaveIfNotLoggedIn} encType="multipart/form-data">
                                        <div className="flex justify-center flex-col gap-4">
                                            <div className="space-y-1">
                                                <Label>Title :</Label>
                                                <input
                                                    type="text"
                                                    value={codeTitle}
                                                    required
                                                    onChange={(e) => setCodeTitle(e.target.value)}
                                                    placeholder="Give name to your project..."
                                                    className=" w-full disable p-2 rounded bg-slate-800 mb-2"
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label>Description :</Label>
                                                <Textarea
                                                    value={codeDescription}
                                                    placeholder="Describe your project.."
                                                    className="h-24 bg-slate-800"
                                                    onChange={(e) => setCodeDescription(e.target.value)}
                                                />
                                            </div>

                                            <div className="space-y-1">
                                                <Label>Upload template : </Label>
                                                <input
                                                    type="file"
                                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 bg-slate-800"
                                                    onChange={handleTemplateFile}
                                                />
                                            </div>

                                            <div className="flex justify-center items-center  w-full">
                                                <Button
                                                    type="submit"
                                                    variant="outline"
                                                    size="lg"
                                                    className="w-[150px] text-md"
                                                >
                                                    {!saveLoading ? <>Save</> : <span className="flex gap-1 justify-center items-center"><Loader2Icon className="animate-spin" size={16} />{" "} Saving</span>}
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}

                {/* share button dialog */}
                {postId &&
                    <>
                        <Dialog>
                            <DialogTrigger className="whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 rounded-md px-3 text-xs flex justify-center items-center gap-1"><Share1Icon />{" "} Share</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="flex justify-center gap-2 items-center mb-2">
                                        <CodeIcon height={25} width={25} />Share your code!
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
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className="whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 h-8 rounded-md px-3 text-xs flex justify-center items-center gap-1">
                                <ListCollapse size={16} /> Project Details
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className=" mb-2">
                                        {projectTitle.toLocaleUpperCase()}
                                    </DialogTitle>
                                    <DialogDescription className="flex flex-col gap-3">
                                        <div className="w-full flex justify-center">
                                        <img src={projectTemplate} className="w-[400px] h-[250px]" alt="template" />
                                        </div>
                                        <div>
                                            {projectDescription}
                                        </div>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </>
                }
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
