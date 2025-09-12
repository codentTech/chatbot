"use client";

import { useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "@/common/components/dashboard/navbar/navbar.component";
import NAVBAR_TITLE from "@/common/constants/navbar-title.constant";
import { checkExpiryDateOfToken } from "@/common/utils/access-token.util";
import { removeUser } from "@/common/utils/users.util";
import Loadar from "@/common/components/loadar/loadar.component";
import useAutoRedirection from "@/common/hooks/use-auto-redirection.hook";

/**
 * Return the component if access token is verified and return to home page if its not
 * @param {component} props take a component
 * @returns component | redirect to home page
 */
export default function Private({ component, title = NAVBAR_TITLE.DOCUMENTS }) {
  const [toggle, setToggle] = useState(false);
  const { logoutLoader } = useSelector((state) => state?.auth);

  const router = useRouter();

  useEffect(() => {
    if (checkExpiryDateOfToken() !== true) {
      removeUser();
      router.push("/");
    }
  }, []);
  useAutoRedirection();

  if (logoutLoader) {
    return <Loadar />;
  }

  return (
    <div className="dashboard-main">
      <div className="sidebar relative basis-1/6"></div>
      <div className="content basis-5/6 bg-secondary-gray">
        <div className="navbar-main">
          <Navbar setToggle={setToggle} value={toggle} title={title} />
        </div>
        <div className="scroll-content">{component}</div>
      </div>
    </div>
  );
}

Private.propTypes = {
  component: PropTypes.element.isRequired,
  title: PropTypes.string,
};
