"use client";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import Settings from "@mui/icons-material/Settings";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Link from "next/link";
import PropTypes from "prop-types";
import useClickOutside from "@/common/hooks/use-click-outside";
import useNavbar from "./use-navbar.hook";

export default function Navbar({ setToggle, value, title }) {
  const {
    user,
    anchorEl,
    open,
    handleClick,
    profileMenu,
    handleLogout,
    router,
    openCreatNewPopup,
    setOpenCreatNewPopup,
    createNewBtnRef,
  } = useNavbar(setToggle, value);

  useClickOutside([createNewBtnRef], [setOpenCreatNewPopup]);

  return (
    <div className="shadow-custom2 relative z-10 flex min-h-[68px] items-center justify-between bg-white px-6 py-3 shadow-[0px_1px_0px_0px_rgba(18,32,59,0.09)]">
      <div className="flex items-center">
        <MenuIcon
          onClick={() => setToggle(!value)}
          sx={{ display: { xs: "block", md: "none", lg: "none" } }}
          className="mr-1 text-2xl font-bold text-text-light-gray xs:inline-block semixl:hidden"
        />
        <h1 className="flex items-center text-2xl font-bold capitalize not-italic leading-9 text-text-dark-gray xs:text-lg lg:text-2xl lg:leading-9">
          {title}
        </h1>
      </div>

      <div className="flex items-center xs:gap-2 lg:gap-6">
        <div
          onClick={() => setOpenCreatNewPopup(!openCreatNewPopup)}
          className="relative flex  h-11 w-[142px] items-center justify-center gap-2 rounded-md !bg-[#DBEAFE] px-3 py-2 hover:cursor-pointer"
        >
          <div className="text-sm font-semibold not-italic leading-[normal] text-text-dark-gray">
            Create New
          </div>
          <KeyboardArrowDownIcon />
          {openCreatNewPopup && (
            <div
              ref={createNewBtnRef}
              className="absolute top-[100%] mt-2 flex w-[142px] flex-col  rounded-md border border-solid border-[#CECECE] bg-white"
            >
              <Link
                href="/offer/create"
                className="flex w-[140px] items-start gap-1.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Offer
                </div>
              </Link>
              <Link
                href="/order/create"
                className="flex w-[142px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Order
                </div>
              </Link>
              <Link
                href="/delivery-notes/create"
                className="flex w-[142px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="whitespace-nowrap text-base font-medium not-italic leading-6 text-text-black">
                  Delivery Notes
                </div>
              </Link>
              <Link
                href="/invoices/create"
                className="flex w-[142px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Invoice
                </div>
              </Link>
              <Link
                href="/credit-note/create"
                className="flex w-[142px] items-center gap-2.5 border-b border-solid border-b-disabled-input px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Credit note
                </div>
              </Link>
              <Link
                href="/customer/create"
                className="flex w-[142px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Customer
                </div>
              </Link>
              <Link
                href="/product/create"
                className="flex w-[142px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Product
                </div>
              </Link>
              <Link
                href="/category/create"
                className="flex w-[142px] items-center gap-2.5 border-b border-solid border-b-disabled-input px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Category
                </div>
              </Link>
              <Link
                href="/expenditure/create"
                className="flex w-[140px] items-center gap-2.5 px-4 py-2 hover:bg-[#f2f6fd]"
              >
                <div className="text-base font-medium not-italic leading-6 text-text-black">
                  Expenditure
                </div>
              </Link>
            </div>
          )}
        </div>

        <Box
          sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              className="m-0 flex items-center gap-2"
            >
              <svg
                width="20"
                height="24"
                viewBox="0 0 10 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.37501 3.5C2.37501 2.05025 3.55026 0.875 5.00001 0.875C6.44976 0.875 7.62501 2.05025 7.62501 3.5C7.62501 4.94975 6.44976 6.125 5.00001 6.125C3.55026 6.125 2.37501 4.94975 2.37501 3.5Z"
                  fill="#BBBBBB"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.188237 11.7281C0.233352 9.10908 2.37033 7 5.00001 7C7.62975 7 9.76677 9.10918 9.81179 11.7283C9.81477 11.902 9.7147 12.061 9.55681 12.1335C8.16909 12.7702 6.62548 13.125 5.0002 13.125C3.37476 13.125 1.83101 12.7701 0.443198 12.1333C0.285307 12.0608 0.185245 11.9018 0.188237 11.7281Z"
                  fill="#BBBBBB"
                />
              </svg>

              <div className="flex items-center">
                <span className="max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap font-dm text-base font-normal leading-6 text-text-dark-gray">
                  {`${user?.profile?.firstName ?? "Username"} ${
                    user?.profile?.lastName ?? ""
                  }`}
                </span>
                <ExpandMoreIcon />
              </div>
            </IconButton>
          </Tooltip>
        </Box>
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={profileMenu}
          onClick={profileMenu}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&:before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              profileMenu();
              router.push("/setting/profile-setting");
            }}
          >
            <ListItemIcon>
              <Settings fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}
Navbar.propTypes = {
  setToggle: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
  title: PropTypes.string,
};
