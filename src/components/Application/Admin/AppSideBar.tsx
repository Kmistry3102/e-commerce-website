import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { adminSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

export default function AppSideBar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14">
        <div className="flex items-center justify-between px-4">
          <Image
            src="/assets/images/logo-black.png"
            alt="logo black"
            width={100}
            height={50}
            className="block dark:hidden"
          />
          <Image
            src="/assets/images/logo-white.png"
            alt="logo white"
            width={100}
            height={50}
            className="dark:block hidden"
          />
          <Button type="button" size="icon" className="">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4">
        <SidebarMenu>
          {adminSidebarMenu.map((menu, index) => (
            <Collapsible key={index} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton asChild>
                    <Link href={menu?.url || "#"}>
                      <>
                        <menu.icon />
                        {menu?.title}
                        {menu?.subMenu && menu?.subMenu?.length > 0 && (
                          <LuChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        )}
                      </>
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu.subMenu && menu.subMenu.length > 0 && (
                  <CollapsibleContent asChild>
                    <SidebarMenuSub>
                      {menu.subMenu.map((subMenuItem, subMenuItemIndex) => (
                        <SidebarMenuSubItem key={subMenuItemIndex}>
                          <SidebarMenuButton asChild>
                            <Link href={subMenuItem.url || "#"}>
                              {subMenuItem.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
