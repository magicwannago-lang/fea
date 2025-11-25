import { useState } from 'react';
import { useTheme } from '@/hooks/useTheme';
import OverviewSection from '@/components/overview/OverviewSection';
import PlantingManagementSection from '@/components/planting/PlantingManagementSection';
import MachineryManagementSection from '@/components/machinery/MachineryManagementSection';
import AccountManagementSection from '@/components/account/AccountManagementSection';
import { cn } from '@/lib/utils';

// 定义导航项类型
interface NavItem {
  id: string;
  title: string;
  icon: string;
  children?: NavItem[];
}

export default function Home() {
  const { theme, toggleTheme } = useTheme();
  const [activeNav, setActiveNav] = useState<string>('overview');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  
  // 导航菜单数据
  const navItems: NavItem[] = [
    {
      id: 'overview',
      title: '成果概览',
      icon: 'fa-chart-line',
      children: [
        { id: 'camera-a', title: '摄像头A区', icon: 'fa-video' },
        { id: 'camera-b', title: '摄像头B区', icon: 'fa-video' }
      ]
    },
    {
      id: 'planting',
      title: '种植管理',
      icon: 'fa-seedling',
      children: [
        { id: 'fertilizer', title: '施肥', icon: 'fa-flask' },
        { id: 'watering', title: '浇水', icon: 'fa-tint' },
        { id: 'lighting', title: '光照', icon: 'fa-sun' },
        { id: 'temperature', title: '温度', icon: 'fa-temperature-high' }
      ]
    },
    {
      id: 'machinery',
      title: '机械管理',
      icon: 'fa-cogs',
      children: [
        { id: 'planting-machine', title: '种植机械管理', icon: 'fa-tractor' },
        { id: 'fertilizer-storage', title: '化肥剩余含量管理', icon: 'fa-boxes' }
      ]
    },
    {
      id: 'account',
      title: '账号管理',
      icon: 'fa-user-cog',
      children: [
        { id: 'normal-account', title: '普通账号', icon: 'fa-user' },
        { id: 'admin-account', title: '管理员账号', icon: 'fa-user-shield' }
      ]
    }
  ];

  // 切换展开/折叠子菜单
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // 设置当前激活的导航项
  const handleNavClick = (id: string) => {
    setActiveNav(id);
  };

  // 根据当前激活的导航项渲染内容
  const renderContent = () => {
    switch (activeNav) {
      case 'overview':
      case 'camera-a':
      case 'camera-b':
        return <OverviewSection activeCamera={activeNav} />;
      case 'planting':
      case 'fertilizer':
      case 'watering':
      case 'lighting':
      case 'temperature':
        return <PlantingManagementSection activeSection={activeNav} />;
      case 'machinery':
      case 'planting-machine':
      case 'fertilizer-storage':
        return <MachineryManagementSection activeSection={activeNav} />;
      case 'account':
      case 'normal-account':
      case 'admin-account':
        return <AccountManagementSection activeSection={activeNav} />;
      default:
        return <OverviewSection activeCamera="overview" />;
    }
  };

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'} transition-colors duration-300`}>
      {/* 左侧导航栏 */}
      <aside className={`w-64 border-r shadow-md ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} transition-all duration-300 flex flex-col`}>
        {/* 顶部标题和主题切换 */}
        <div className={`p-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between`}>
          <h1 className="text-xl font-bold flex items-center">
            <i className="fa-solid fa-leaf mr-2 text-green-500"></i>
            智慧农业监控
          </h1>
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
            aria-label={theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式'}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
        </div>
        
        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <div key={item.id} className="mb-1">
              {/* 主菜单项 */}
              <button
                onClick={() => {
                  handleNavClick(item.id);
                  if (item.children && item.children.length > 0) {
                    toggleExpand(item.id);
                  }
                }}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                  activeNav === item.id 
                    ? 'bg-green-500 text-white' 
                    : theme === 'dark' 
                      ? 'hover:bg-gray-700' 
                      : 'hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center">
                  <i className={`fa-solid ${item.icon} mr-3`}></i>
                  {item.title}
                </span>
                {item.children && item.children.length > 0 && (
                  <i className={`fa-solid transition-transform ${expandedItems[item.id] ? 'fa-chevron-down rotate-180' : 'fa-chevron-down'}`}></i>
                )}
              </button>
              
              {/* 子菜单项 */}
              {item.children && item.children.length > 0 && expandedItems[item.id] && (
                <div className={`pl-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                  {item.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handleNavClick(child.id)}
                      className={`w-full text-left px-4 py-2 flex items-center transition-colors ${
                        activeNav === child.id 
                          ? 'bg-green-400 text-white' 
                          : theme === 'dark' 
                            ? 'hover:bg-gray-700' 
                            : 'hover:bg-gray-100'
                      }`}
                    >
                      <i className={`fa-solid ${child.icon} mr-3`}></i>
                      {child.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        
        {/* 底部版权信息 */}
        <div className={`p-4 border-t text-sm text-center ${theme === 'dark' ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
          © 2025 智慧农业物联网平台
        </div>
      </aside>
      
      {/* 右侧内容区域 */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}