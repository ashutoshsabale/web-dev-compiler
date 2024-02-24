import CodeEditor from "@/components/CodeEditor";
import HelperHeader from "@/components/HelperHeader";
import RenderCode from "@/components/RenderCode";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { updateFullCode } from "@/store/slices/compilerSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "sonner";


function Compiler() {
    const { postId } = useParams()
    const dispatch = useDispatch()

    const loadCodeHandler = async (postId: string) => {
        try {
            const data = { postId }
            const response = await fetch("http://localhost:8000/api/v1/compiler/load-code",{
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(data)
            })

            const result =  await response.json();

            if(!response.ok) {
                console.log(result.error)
                toast.error('Error while saving code please try again')
            }

            if(response.ok) {
                dispatch(updateFullCode(result?.data?.fullcode))
                // toast.success('Code loaded successfully')
            }

        } catch (error) {
            console.log(error)
            toast.error("Error while loading code")
        }
    }

    useEffect(()=>{
        if(postId) loadCodeHandler(postId);
    },[postId])

    return (
        <ResizablePanelGroup direction="horizontal" className="">
            <ResizablePanel className="flex flex-col h-[calc(100dvh-60px)] min-w-[350px] rounded-xl" defaultSize={50}>
                <HelperHeader />
                <div className="text-lg overflow-hidden box-border">
                    <CodeEditor />
                </div>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel className="flex h-[calc(100dvh-60px)] min-w-[350px] " defaultSize={50}>
                <div className="w-full h-[calc(100vh-60px)]">
                    <RenderCode />
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}

export default Compiler;
