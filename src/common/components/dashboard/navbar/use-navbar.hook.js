import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setLogoutLoader } from '@/provider/features/auth/auth.slice';

export default function useNavbar() {
  const [openCreatNewPopup, setOpenCreatNewPopup] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const createNewBtnRef = useRef(null);

  const user = useSelector((state) => state.user.user.data);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const profileMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(setLogoutLoader(true));
    const response = await dispatch(logout());
    if (response?.payload) {
      router.push('/');
    }
  };

  return {
    dispatch,
    user,
    anchorEl,
    setAnchorEl,
    open,
    handleClick,
    profileMenu,
    handleLogout,
    router,
    openCreatNewPopup,
    setOpenCreatNewPopup,
    createNewBtnRef
  };
}
