import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateLoggedInUser } from "@/store/slices/authSlice"
import { RootState } from "@/store/store"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"


const Dropdown =  () => {
    const {currentUser} = useSelector((state: RootState) => state.authSlice)
    const navigate = useNavigate()
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const  response = await fetch("http://localhost:8000/api/v1/users/logout",{
                method:"POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({})
            })

            const result = await response.json();
            console.log("result: ", result)

            if(response.ok){
                dispatch(updateLoggedInUser(false))
                toast.success("Logged out successfully")
                navigate("/login")
            }

        } catch (error) {
            console.log("Error is: ",error)
        }
    }

    return (
        <DropdownMenu>
          <DropdownMenuTrigger >
                <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                    <AvatarImage className="object-cover w-full h-full" src={currentUser?.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={()=> navigate("/profile")}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/my-codes")}>
                My Codes
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuSub >
                <DropdownMenuSubTrigger >Invite users</DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

export default Dropdown