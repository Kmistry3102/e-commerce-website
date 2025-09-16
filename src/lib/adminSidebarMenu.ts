import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";
import { AiOutlineDashboard } from "react-icons/ai";
import { BiCategory } from "react-icons/bi";
import { IoShirtOutline } from "react-icons/io5";
import { RiCoupon2Line } from "react-icons/ri";
import { MdOutlineShoppingBag } from "react-icons/md";
import { LuUserRound } from "react-icons/lu";
import { IoMdStarOutline } from "react-icons/io";
import { MdOutlinePermMedia } from "react-icons/md";

export const adminSidebarMenu = [
  {
    title: "Dashboard",
    icon: AiOutlineDashboard,
    url: ADMIN_DASHBOARD,
  },
  {
    title: "Category",
    icon: BiCategory,
    url: "#",
    subMenu: [
      {
        title: "Add Category",
        url: "#",
      },
      {
        title: "All Category",
        url: "#",
      }
    ],
  },
  {
    title: "Products",
    icon: IoShirtOutline,
    url: "#",
    subMenu: [
      {
        title: "Add Product",
        url: "#",
      },
      {
        title: "Add Variant",
        url: "#",
      },
      {
        title: "All Product",
        url: "#",
      },
      {
        title: "Product Variant",
        url: "#",
      }
    ],
  },
  {
    title: "Coupons",
    icon: RiCoupon2Line,
    url: "#",
    subMenu: [
      {
        title: "Add Coupon",
        url: "#",
      },
      {
        title: "All Coupon",
        url: "#",
      }
    ],
  },
  {
    title: "Orders",
    icon: MdOutlineShoppingBag,
    url: "#",
  },
  {
    title: "Customers",
    icon: LuUserRound,
    url: "#",
  },
  {
    title: "Ratings & Reviews",
    icon: IoMdStarOutline,
    url: "#",
  },
  {
    title: "Media",
    icon: MdOutlinePermMedia,
    url: "#",
  },
];