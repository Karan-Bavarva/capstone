import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../../../context/SidebarContext";
import { UserData } from "../../../context/UserContext";
import { BookOpen } from "lucide-react";

/* ================= ROLE BASED MENU ================= */

const sidebarConfig = {
  ADMIN: {
    main: [
      { name: "Dashboard", path: "/admin/dashboard", icon: "/images/icons/dashboard.svg" },
      { name: "Users", path: "/admin/users", icon: "/images/icons/users.svg" },
      { name: "Courses", path: "/admin/courses", icon: "/images/icons/courses.svg" },
    ],
    others: [
      
      { name: "Profile", path: "/account/profile", icon: "/images/icons/profile.svg" },
    ],
  },

  TUTOR: {
    main: [
      { name: "Dashboard", path: "/tutor/dashboard", icon: "/images/icons/dashboard.svg" },
    ],
    others: [
      {
        name: "My Courses",
        icon: "/images/icons/courses.svg",
        subItems: [
          { name: "All Courses", path: "/tutor/my-courses" },
          { name: "Add Course", path: "/tutor/my-courses/add" },
        ],
      },
      { name: "Profile", path: "/account/profile", icon: "/images/icons/profile.svg" },
    ],
  },

  STUDENT: {
    main: [
      { name: "Dashboard", path: "/student/dashboard", icon: "/images/icons/dashboard.svg" },
      { name: "My Courses", path: "/student/my-courses", icon: "/images/icons/courses.svg" },
      { name: "Profile", path: "/account/profile", icon: "/images/icons/profile.svg" },
      { name: "Certificates", path: "/student/certificates", icon: "/images/icons/certificates.svg" },
      { name: "Explore Courses", path: "/courses", icon: "/images/icons/explore-courses.svg" },
    ],
    others: [],
  },
};

/* ================= COMPONENT ================= */

const AppSidebar = () => {
  const { user } = UserData();
  const role = (user?.role || "STUDENT").toUpperCase();

  const isTutorInactive = role === "TUTOR" && user?.status !== 'ACTIVE';

  const navItems = isTutorInactive
    ? []
    : sidebarConfig[role]?.main || [];

  const othersItems = isTutorInactive
    ? [
        { name: "Profile", path: "/account/profile", icon: "/images/icons/profile.svg" },
      ]
    : sidebarConfig[role]?.others || [];

  const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let matched = false;
    othersItems.forEach((nav, index) => {
      nav.subItems?.forEach((s) => {
        if (isActive(s.path)) {
          setOpenSubmenu({ type: "others", index });
          matched = true;
        }
      });
    });
    if (!matched) setOpenSubmenu(null);
  }, [location, isActive, othersItems]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((p) => ({
          ...p,
          [key]: subMenuRefs.current[key].scrollHeight,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prev) =>
      prev?.index === index ? null : { type: "others", index }
    );
  };

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-3">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item ${openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <img src={nav.icon} alt="" className="menu-item-icon" />
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </button>
          ) : (
            <Link
              to={nav.path}
              className={`menu-item ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
            >
              <img src={nav.icon} alt="" className="menu-item-icon" />
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => (subMenuRefs.current[`others-${index}`] = el)}
              className="overflow-hidden transition-all"
              style={{
                height:
                  openSubmenu?.index === index
                    ? `${subMenuHeight[`others-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="ml-8 mt-2 space-y-1">
                {nav.subItems.map((s) => (
                  <li key={s.name}>
                    <Link
                      to={s.path}
                      className={`menu-dropdown-item ${
                        isActive(s.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <aside
        className={`fixed lg:relative mt-16 lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 h-screen border-r dark:border-gray-800 transition-all z-40
        ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}`}
        onMouseEnter={() => !isExpanded && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4 flex items-center justify-center">
          <Link to="/" className="flex items-center space-x-2">
            {isExpanded || isMobileOpen || isHovered ? (
              <>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-gray-800 dark:text-white">
                  EduPlatform
                </span>
              </>
            ) : (
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-2 rounded-lg">
                <BookOpen className="text-white" size={24} />
              </div>
            )}
          </Link>
        </div>

        <nav className="px-4 space-y-6">
          {renderMenuItems(navItems)}
          {renderMenuItems(othersItems)}
        </nav>
      </aside>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={toggleMobileSidebar}
        />
      )}
    </>
  );
};

export default AppSidebar;
