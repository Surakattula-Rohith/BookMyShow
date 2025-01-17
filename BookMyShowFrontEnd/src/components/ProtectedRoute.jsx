import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/loaderSlice";
import { GetCurrentUser } from "../api/user";
import { setUser } from "../redux/userSlice";
import { Layout, Menu, message } from "antd";
import { Header } from "antd/es/layout/layout";
import {
  HomeOutlined,
  LogoutOutlined,
  ProfileOutlined,
  UserOutlined,
} from "@ant-design/icons";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHomeClick = () => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user?.role === "partner") {
      navigate("/partner", { replace: true });
    } else if (user?.role === "user"){
      navigate("/", { replace: true });
    }
  };

  const handleProfileClick = () => {
    if (user?.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user?.role === "partner") {
      navigate("/partner", { replace: true });
    } else if (user?.role === "user"){
      navigate("/profile", { replace: true });
    }
  };

  const logout = () => {
    localStorage.removeItem("tokenForBMS");
    navigate("/login", { replace: true });
  };

  const navItems = [
    {
      key: "home",
      label: <span onClick={handleHomeClick}>Home</span>,
      icon: <HomeOutlined />,
    },
    {
      key: "profile",
      label: user ? user.name : "",
      icon: <UserOutlined />,
      children: [
        {
          key: "my-profile",
          label: <span onClick={handleProfileClick}>My Profile</span>,
          icon: <ProfileOutlined />,
        },
        {
          key: "logout",
          label: (
            <span onClick={logout}>
              Log out
            </span>
          ),
          icon: <LogoutOutlined />,
        },
      ],
    },
  ];

  const getValidUser = async () => {
    try {
      dispatch(showLoading());
      const response = await GetCurrentUser();
      dispatch(setUser(response?.data));
    } catch (error) {
      message.error(error);
    } finally {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (localStorage.getItem("tokenForBMS")) {
      getValidUser();
    } else {
      navigate("/login");
    }
  }, []);
  return (
    user && (
      <>
        <Layout>
          <Header
            className="d-flex justify-content-between"
            style={{
              position: "sticky",
              top: 0,
              zIndex: 1,
              width: "100%",
              alignItems: "center",
            }}
          >
            <h3
              className="text-white m-0"
              style={{ color: "white", cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            >
              Book My Show
            </h3>
            <Menu theme="dark" mode="horizontal" items={navItems} />
          </Header>
        </Layout>
        <div>{children}</div>
      </>
    )
  );
};

export default ProtectedRoute;
