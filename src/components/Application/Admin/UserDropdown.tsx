"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Link from "next/link";
import { IoShirtOutline } from "react-icons/io5";
import { MdOutlineShoppingBag } from "react-icons/md";

export default function UserDropdown() {
  const { auth } = useSelector((state: RootState) => state.auth);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="me-5 w-44">
        <DropdownMenuLabel>
          <p className="font-medium">{auth?.name}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="" className="cursor-pointer">
            <IoShirtOutline />
            New Product
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="" className="cursor-pointer">
            <MdOutlineShoppingBag />
            Orders
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
