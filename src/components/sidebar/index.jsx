import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../context/UserContext';
import vmslogo from "../../assets/images/vms-logo.png";
import MenuIcon from '@mui/icons-material/Menu';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import BusinessIcon from '@mui/icons-material/Business';
import CardTravelIcon from '@mui/icons-material/CardTravel';
import HistoryIcon from '@mui/icons-material/History';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';


const navItemsAdmin = [
  { name: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/' },
  { name: 'Visitors', icon: <PeopleOutlinedIcon />, path: '/visitor' },
  { name: 'Employees', icon: <SupervisorAccountIcon />, path: '/user' },
  { name: 'Department', icon: <BusinessIcon />, path: '/dept' },
  { name: 'Passes', icon: <CardTravelIcon />, path: '/pass' },
  { name: 'Visit Logs', icon: <HistoryIcon />, path: '/log' },
  { name: 'FAQ', icon: <LiveHelpIcon />, path: '/faq' },
];

const navItemsReceptionist = [
  { name: 'Dashboard', icon: <HomeOutlinedIcon />, path: '/' },
  { name: 'Visitors', icon: <PeopleOutlinedIcon />, path: '/visitor' },
  { name: 'Passes', icon: <CardTravelIcon />, path: '/pass' },
  { name: 'Visit Logs', icon: <HistoryIcon />, path: '/log' },
  { name: 'FAQ', icon: <LiveHelpIcon />, path: '/faq' },
];

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [role, setRole] = useState('');
  const { setUser } = useContext(UserContext);
  const location = useLocation();

  useEffect(() => {
    const storedRole = localStorage.getItem("user_type");
    setRole(storedRole);
  }, [setUser]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (role === "Guard") {
    return null;
  }

  const navItems = role === 'admin' ? navItemsAdmin : navItemsReceptionist;

  return (
    <aside className={`bg-customGreen transition-width duration-300 ${isCollapsed ? 'w-16' : 'w-56'}`} aria-label="Sidebar">
      <div className="overflow-y-auto py-2 px-3 rounded">
        <div className="flex justify-between items-center mb-6 h-14">
          {/* <img src={modlogo} alt="MOD Logo" className={`h-16 pl-2 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`} /> */}
          <img src={vmslogo} alt="VMS Logo" className={`h-16 pl-1 transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`} />
          <MenuIcon className="text-white cursor-pointer h-14" style={{ fontSize: '2rem' }} onClick={toggleSidebar} />
        </div>
        <nav>
          {navItems.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-green-700 ${location.pathname === item.path ? 'bg-green-700' : ''
                }`}
            >
              <span className={`inline-block w-6 text-center mr-2 `}>{item.icon}</span>
              <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>{item.name}</span>
            </Link>
          ))}
        </nav>
        {/* <div className="absolute" >
                <div className="fixed bottom-2 flex justify-center items-center">
                <img src={becillogo} alt="MOD Logo" style={{height:"100px"}} className={`transition-opacity duration-300 ${isCollapsed ? 'hidden' : 'block'}`} />
                </div>
        </div> */}
      </div>
    </aside>
  )
};

export default SideBar;
