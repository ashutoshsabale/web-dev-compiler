import { Share1Icon, FileTextIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "./ui/select"
import { useDispatch, useSelector } from "react-redux";
import { CompilerSliceStateType, updateCurrentLanguage } from "@/store/slices/compilerSlice";
import { RootState } from "@/store/store";



function HelperHeader() {
    const dispatch = useDispatch();
    const defaultLanguage = useSelector((state: RootState) => state.compilerSlice.currentLanguage)

    return (
        <div className="__helper_header flex justify-between h-[50px] gap-3 bg-black text-white p-2">
            <div className="__btn_container flex gap-2">
                <Button className="flex justify-center items-center gap-1" variant="success" size="sm">
                    <FileTextIcon />
                    Save
                </Button>
                <Button className="flex justify-center items-center gap-1" variant="secondary" size="sm">
                    <Share1Icon />{" "} Share
                </Button>
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
