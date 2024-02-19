import CodeEditor from "@/components/CodeEditor";
import HelperHeader from "@/components/HelperHeader";
import RenderCode from "@/components/RenderCode";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";



function Compiler() {
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
