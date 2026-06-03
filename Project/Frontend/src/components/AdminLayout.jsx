import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Settings,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { Flex } from "./ui";

const LayoutWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fe; /* Premium Horizon UI Background */
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
`;

const Sidebar = styled.aside`
  width: 280px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  border-right: 1px solid rgba(226, 232, 240, 0.8);
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 50;
`;

const LogoArea = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #f1f5f9;

  h2 {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.05em;
    color: #2b3674;
    margin: 0;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: ${(p) => (p.$active ? 700 : 600)};
  color: ${(p) => (p.$active ? "#4318FF" : "#A3AED0")};
  background: ${(p) => (p.$active ? "rgba(67, 24, 255, 0.05)" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(67, 24, 255, 0.03);
    color: #4318ff;
  }
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const TopHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2.5rem;
  background: transparent;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 40;
`;

const HeaderGreeting = styled.div`
  h1 {
    font-size: 2.1rem;
    font-weight: 800;
    color: #2b3674;
    letter-spacing: -1px;
    margin-bottom: 0.25rem;
  }
  p {
    color: #707eae;
    font-weight: 500;
    font-size: 0.95rem;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #ffffff;
  padding: 0.5rem 0.5rem 0.5rem 1.5rem;
  border-radius: 30px;
  box-shadow: 0px 18px 40px rgba(112, 144, 176, 0.12);
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f4f7fe;
  padding: 0.5rem 1rem;
  border-radius: 20px;

  input {
    border: none;
    background: transparent;
    outline: none;
    color: #2b3674;
    font-weight: 500;
    font-size: 0.85rem;
    &::placeholder {
      color: #8f9bba;
    }
  }
`;

const ActionBtn = styled.button`
  background: transparent;
  border: none;
  color: #a3aed0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  &:hover {
    color: #4318ff;
  }
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4318ff 0%, #868cff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(67, 24, 255, 0.2);
`;

const PageContainer = styled.div`
  padding: 0 2.5rem 3rem 2.5rem;
`;

const AdminLayout = ({
  children,
  title = "Dashboard",
  subtitle = "Overview",
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { adminLogout, adminUser } = useAuthStore();

  const handleLogout = () => {
    adminLogout();
    navigate("/admin/login");
  };

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Campaigns", path: "/admin/projects", icon: FileText },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart2 },
    { name: "Complaints", path: "/admin/complaints", icon: ShieldAlert },
    {
      name: "Verification",
      path: "/admin/document-verification",
      icon: ShieldCheck,
    },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <LayoutWrapper>
      <Sidebar>
        <LogoArea>
          <div
            style={{
              background: "linear-gradient(135deg, #4318FF, #868CFF)",
              borderRadius: "10px",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
            }}
          >
            S
          </div>
          <h2>Admin Shell</h2>
        </LogoArea>
        <NavList>
          {menu.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.includes(item.path);
            return (
              <NavItem key={item.path} to={item.path} $active={active}>
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                {item.name}
              </NavItem>
            );
          })}
        </NavList>
        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <NavItem
            as="button"
            onClick={handleLogout}
            style={{
              width: "100%",
              justifyContent: "flex-start",
              color: "#E31A1A",
            }}
          >
            <LogOut size={20} />
            Sign Out
          </NavItem>
        </div>
      </Sidebar>

      <MainContent>
        <TopHeader>
          <HeaderGreeting>
            <p>Pages / {title}</p>
            <h1>{title}</h1>
          </HeaderGreeting>
          <HeaderActions>
            <SearchBox>
              <Search size={16} color="#2B3674" />
              <input type="text" placeholder="Search..." />
            </SearchBox>
            <ActionBtn>
              <Bell size={20} />
            </ActionBtn>
            <Avatar>{adminUser?.name?.charAt(0) || "A"}</Avatar>
            <ActionBtn
              onClick={handleLogout}
              title="Sign Out"
              style={{ color: "#E31A1A" }}
            >
              <LogOut size={20} />
            </ActionBtn>
          </HeaderActions>
        </TopHeader>

        <PageContainer>{children}</PageContainer>
      </MainContent>
    </LayoutWrapper>
  );
};

export default AdminLayout;
