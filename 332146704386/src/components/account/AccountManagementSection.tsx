import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/useTheme';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/authContext';

interface AccountManagementSectionProps {
  activeSection: string;
}

// 模拟普通账号数据
const generateNormalAccounts = () => {
  return [
    { id: 1, username: 'farmer_zhang', name: '张农夫', role: '普通用户', status: 'active', lastLogin: '2025-11-25 08:30:00', created: '2025-01-15' },
    { id: 2, username: 'farmer_li', name: '李农夫', role: '普通用户', status: 'active', lastLogin: '2025-11-24 16:45:00', created: '2025-02-20' },
    { id: 3, username: 'farmer_wang', name: '王农夫', role: '普通用户', status: 'inactive', lastLogin: '2025-11-10 10:15:00', created: '2025-03-05' },
    { id: 4, username: 'farmer_zhao', name: '赵农夫', role: '普通用户', status: 'active', lastLogin: '2025-11-25 14:20:00', created: '2025-04-12' },
    { id: 5, username: 'farmer_chen', name: '陈农夫', role: '普通用户', status: 'active', lastLogin: '2025-11-23 09:10:00', created: '2025-05-18' }
  ];
};

// 模拟管理员账号数据
const generateAdminAccounts = () => {
  return [
    { id: 101, username: 'admin_super', name: '超级管理员', role: '超级管理员', status: 'active', lastLogin: '2025-11-25 20:45:00', created: '2024-12-01' },
    { id: 102, username: 'admin_system', name: '系统管理员', role: '系统管理员', status: 'active', lastLogin: '2025-11-25 15:30:00', created: '2025-01-10' },
    { id: 103, username: 'admin_security', name: '安全管理员', role: '安全管理员', status: 'active', lastLogin: '2025-11-24 18:20:00', created: '2025-02-05' }
  ];
};

// 模拟登录统计数据
const generateLoginStats = () => {
  return [
    { month: '1月', admin: 120, normal: 450 },
    { month: '2月', admin: 135, normal: 480 },
    { month: '3月', admin: 140, normal: 520 },
    { month: '4月', admin: 160, normal: 580 },
    { month: '5月', admin: 180, normal: 650 },
    { month: '6月', admin: 170, normal: 630 }
  ];
};

const AccountManagementSection: React.FC<AccountManagementSectionProps> = ({ activeSection }) => {
  const { theme } = useTheme();
  const { logout } = useContext(AuthContext);
  const [normalAccounts, setNormalAccounts] = useState(generateNormalAccounts());
  const [adminAccounts, setAdminAccounts] = useState(generateAdminAccounts());
  const [loginStats, setLoginStats] = useState(generateLoginStats());
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  // 渲染普通账号管理界面
  const renderNormalAccountManagement = () => {
    // 过滤账号列表
    const filteredAccounts = normalAccounts.filter(
      account => 
        account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 处理账号状态变更
    const handleStatusChange = (id: number) => {
      setIsProcessing(true);
      
      // 模拟操作延迟
      setTimeout(() => {
        setIsProcessing(false);
        setNormalAccounts(prev => prev.map(account => 
          account.id === id 
            ? { ...account, status: account.status === 'active' ? 'inactive' : 'active' } 
            : account
        ));
        toast.success('账号状态已更新');
      }, 800);
    };

    // 处理编辑账号
    const handleEdit = (account: any) => {
      setEditingAccount(account);
      setShowModal(true);
    };

    // 处理删除账号
    const handleDelete = (id: number) => {
      if (window.confirm('确定要删除这个账号吗？此操作不可撤销。')) {
        setIsProcessing(true);
        
        // 模拟操作延迟
        setTimeout(() => {
          setIsProcessing(false);
          setNormalAccounts(prev => prev.filter(account => account.id !== id));
          toast.success('账号已删除');
        }, 800);
      }
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 账号概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">普通账号概览</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="text-sm mb-1">总账号数</div>
              <div className="text-2xl font-bold text-blue-500">{normalAccounts.length}</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="text-sm mb-1">活跃账号</div>
              <div className="text-2xl font-bold text-green-500">
                {normalAccounts.filter(a => a.status === 'active').length}
              </div>
            </div>
          </div>
          
          {/* 账号状态分布 */}
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '活跃', value: normalAccounts.filter(a => a.status === 'active').length, color: '#10b981' },
                    { name: '非活跃', value: normalAccounts.filter(a => a.status === 'inactive').length, color: '#6b7280' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#10b981" />
                  <Cell fill="#6b7280" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* 快速操作 */}
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingAccount(null);
                setShowModal(true);
              }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg inline-flex items-center ${
                theme === 'dark' 
                  ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                  : 'bg-green-100 hover:bg-green-200 text-green-800'
              } transition-colors`}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              创建新账号
            </motion.button>
          </div>
        </motion.div>
        
        {/* 登录统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">登录统计</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={loginStats}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#eee'} />
                <XAxis dataKey="month" stroke={theme === 'dark' ? '#aaa' : '#666'} />
                <YAxis stroke={theme === 'dark' ? '#aaa' : '#666'} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#333' : '#fff',
                    borderColor: theme === 'dark' ? '#555' : '#ddd'
                  }} 
                />
                <Legend />
                <Bar dataKey="normal" name="普通用户" fill="#3b82f6" />
                <Bar dataKey="admin" name="管理员" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* 最近活动 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">最近活动</h3>
          
          <div className="space-y-3">
            {normalAccounts
              .sort((a, b) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime())
              .slice(0, 4)
              .map((account) => (
                <div key={account.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-center">
                    <div className="font-medium">{account.name}</div>
                    <div className={`text-xs ${
                      account.status === 'active' 
                        ? 'text-green-500' 
                        : 'text-gray-500'
                    }`}>
                      {account.status === 'active' ? '在线' : '离线'}
                    </div>
                  </div>
                  <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    上次登录: {account.lastLogin}
                  </div>
                </div>
              ))}
          </div>
          
          {/* 查看全部按钮 */}
          <div className="mt-4 text-center">
            <button className={`px-4 py-2 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-100 shadow'
            } transition-colors`}>
              查看全部活动
            </button>
          </div>
        </motion.div>
        
        {/* 账号列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-3`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">普通账号列表</h3>
            
            {/* 搜索框 */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索账号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-9 pr-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
              />
              <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className="py-3 px-4 text-left">用户名</th>
                  <th className="py-3 px-4 text-left">姓名</th>
                  <th className="py-3 px-4 text-left">角色</th>
                  <th className="py-3 px-4 text-left">状态</th>
                  <th className="py-3 px-4 text-left">上次登录</th>
                  <th className="py-3 px-4 text-left">创建日期</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account) => (
                  <tr 
                    key={account.id} 
                    className={`${
                      theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="py-3 px-4">{account.username}</td>
                    <td className="py-3 px-4">{account.name}</td>
                    <td className="py-3 px-4">{account.role}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {account.status === 'active' ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            活跃
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
                            非活跃
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.lastLogin}
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.created}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(account)}
                          disabled={isProcessing}
                          className={`px-2 py-1 text-xs rounded ${
                            theme === 'dark' 
                              ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                          } transition-colors`}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        
                        <button 
                          onClick={() => handleStatusChange(account.id)}
                          disabled={isProcessing}
                          className={`px-2 py-1 text-xs rounded ${
                            account.status === 'active'
                              ? theme === 'dark' 
                                ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                                : 'bg-red-100 hover:bg-red-200 text-red-800'
                              : theme === 'dark' 
                                ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                          } transition-colors`}
                        >
                          {isProcessing ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : account.status === 'active' ? (
                            <i className="fa-solid fa-ban"></i>
                          ) : (
                            <i className="fa-solid fa-check"></i>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(account.id)}
                          disabled={isProcessing}
                          className={`px-2 py-1 text-xs rounded ${
                            theme === 'dark' 
                              ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                              : 'bg-red-100 hover:bg-red-200 text-red-800'
                          } transition-colors`}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {filteredAccounts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      没有找到匹配的账号
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  // 渲染管理员账号管理界面
  const renderAdminAccountManagement = () => {
    // 处理管理员账号操作
    const handleAdminAction = (id: number, action: string) => {
      if (action === 'delete' && window.confirm('确定要删除这个管理员账号吗？此操作可能影响系统安全。')) {
        setIsProcessing(true);
        
        // 模拟操作延迟
        setTimeout(() => {
          setIsProcessing(false);
          setAdminAccounts(prev => prev.filter(account => account.id !== id));
          toast.success('管理员账号已删除');
        }, 800);
      } else if (action === 'edit') {
        setEditingAccount(adminAccounts.find(a => a.id === id));
        setShowModal(true);
      } else if (action === 'changeStatus') {
        setIsProcessing(true);
        
        // 模拟操作延迟
        setTimeout(() => {
          setIsProcessing(false);
          setAdminAccounts(prev => prev.map(account => 
            account.id === id 
              ? { ...account, status: account.status === 'active' ? 'inactive' : 'active' } 
              : account
          ));
          toast.success('管理员账号状态已更新');
        }, 800);
      }
    };

    // 超级管理员安全提示
    const isSuperAdmin = (account: any) => {
      return account.role === '超级管理员';
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 管理员账号概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">管理员账号概览</h3>
          
          <div className={`p-4 rounded-lg mb-4 border ${
            theme === 'dark' ? 'border-red-900 bg-red-900 bg-opacity-20' : 'border-red-200 bg-red-50'
          }`}>
            <div className="flex items-start">
              <i className="fa-solid fa-shield-alt text-red-500 mt-1 mr-2"></i>
              <p className="text-sm">管理员账号拥有系统最高权限，请谨慎管理和操作。</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="text-sm mb-1">总管理员账号数</div>
              <div className="text-2xl font-bold text-blue-500">{adminAccounts.length}</div>
            </div><div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
              <div className="text-sm mb-1">活跃管理员账号</div>
              <div className="text-2xl font-bold text-green-500">
                {adminAccounts.filter(a => a.status === 'active').length}
              </div>
            </div>
          </div>
          
          {/* 快速操作 */}
          <div className="mt-4 text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setEditingAccount(null);
                setShowModal(true);
              }}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg inline-flex items-center ${
                theme === 'dark' 
                  ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                  : 'bg-green-100 hover:bg-green-200 text-green-800'
              } transition-colors`}
            >
              <i className="fa-solid fa-plus mr-2"></i>
              创建管理员
            </motion.button>
          </div>
        </motion.div>
        
        {/* 管理员权限分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">管理员权限分布</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '超级管理员', value: adminAccounts.filter(a => a.role === '超级管理员').length, color: '#ef4444' },
                    { name: '系统管理员', value: adminAccounts.filter(a => a.role === '系统管理员').length, color: '#3b82f6' },
                    { name: '安全管理员', value: adminAccounts.filter(a => a.role === '安全管理员').length, color: '#10b981' }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  <Cell fill="#ef4444" />
                  <Cell fill="#3b82f6" />
                  <Cell fill="#10b981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* 安全提示 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">安全提示</h3>
          
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'}`}>
              <div className="flex items-start">
                <i className="fa-solid fa-exclamation-triangle text-yellow-500 mt-1 mr-2"></i>
                <p className="text-sm">建议定期更换管理员密码，增强账号安全性。</p>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'}`}>
              <div className="flex items-start">
                <i className="fa-solid fa-info-circle text-blue-500 mt-1 mr-2"></i>
                <p className="text-sm">记录管理员账号的登录活动，及时发现异常登录。</p>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'}`}>
              <div className="flex items-start">
                <i className="fa-solid fa-check-circle text-green-500 mt-1 mr-2"></i>
                <p className="text-sm">设置适当的权限分离，避免单个账号拥有过多权限。</p>
              </div>
            </div>
          </div>
          
          {/* 安全检查按钮 */}
          <div className="mt-4 text-center">
            <button className={`px-4 py-2 rounded-lg text-sm ${
              theme === 'dark' 
                ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                : 'bg-red-100 hover:bg-red-200 text-red-800'
            } transition-colors`}>
              <i className="fa-solid fa-shield-alt mr-2"></i>
              运行安全检查
            </button>
          </div>
        </motion.div>
        
        {/* 管理员账号列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-3`}
        >
          <h3 className="font-semibold mb-4">管理员账号列表</h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className="py-3 px-4 text-left">用户名</th>
                  <th className="py-3 px-4 text-left">姓名</th>
                  <th className="py-3 px-4 text-left">角色</th>
                  <th className="py-3 px-4 text-left">状态</th>
                  <th className="py-3 px-4 text-left">上次登录</th>
                  <th className="py-3 px-4 text-left">创建日期</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {adminAccounts.map((account) => (
                  <tr 
                    key={account.id} 
                    className={`${
                      isSuperAdmin(account)
                        ? theme === 'dark' ? 'bg-red-900 bg-opacity-10 border-b border-gray-700' : 'bg-red-50 border-b border-gray-200'
                        : theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="py-3 px-4">
                      {account.username}
                      {isSuperAdmin(account) && (
                        <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                          theme === 'dark' 
                            ? 'bg-red-900 text-red-300' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          最高权限
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">{account.name}</td>
                    <td className="py-3 px-4">{account.role}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        account.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {account.status === 'active' ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            活跃
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-1.5"></span>
                            非活跃
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.lastLogin}
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {account.created}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAdminAction(account.id, 'edit')}
                          disabled={isProcessing || isSuperAdmin(account)}
                          className={`px-2 py-1 text-xs rounded ${
                            isSuperAdmin(account)
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'dark' 
                                ? 'bg-blue-900 hover:bg-blue-800 text-blue-300' 
                                : 'bg-blue-100 hover:bg-blue-200 text-blue-800'
                          } transition-colors`}
                        >
                          <i className="fa-solid fa-edit"></i>
                        </button>
                        
                        <button 
                          onClick={() => handleAdminAction(account.id, 'changeStatus')}
                          disabled={isProcessing || isSuperAdmin(account)}
                          className={`px-2 py-1 text-xs rounded ${
                            isSuperAdmin(account)
                              ? 'opacity-50 cursor-not-allowed'
                              : account.status === 'active'
                                ? theme === 'dark' 
                                  ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                                  : 'bg-red-100 hover:bg-red-200 text-red-800'
                                : theme === 'dark' 
                                  ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                                  : 'bg-green-100 hover:bg-green-200 text-green-800'
                          } transition-colors`}
                        >
                          {isProcessing ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : account.status === 'active' ? (
                            <i className="fa-solid fa-ban"></i>
                          ) : (
                            <i className="fa-solid fa-check"></i>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => handleAdminAction(account.id, 'delete')}
                          disabled={isProcessing || isSuperAdmin(account)}
                          className={`px-2 py-1 text-xs rounded ${
                            isSuperAdmin(account)
                              ? 'opacity-50 cursor-not-allowed'
                              : theme === 'dark' 
                                ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                                : 'bg-red-100 hover:bg-red-200 text-red-800'
                          } transition-colors`}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </button>
                        
                        <button 
                          disabled={isProcessing}
                          className={`px-2 py-1 text-xs rounded ${
                            theme === 'dark' 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-100 hover:bg-gray-200'
                          } transition-colors`}
                        >
                          <i className="fa-solid fa-key"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 安全日志按钮 */}
          <div className="mt-4 text-right">
            <button className={`px-4 py-2 rounded-lg inline-flex items-center ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-100 shadow'
            } transition-colors`}>
              <i className="fa-solid fa-file-alt mr-2"></i>
              查看安全日志
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // 根据当前激活的区域渲染对应内容
  const renderContent = () => {
    const type = activeSection === 'account' ? 'normal-account' : activeSection;
    
    switch (type) {
      case 'normal-account':
        return renderNormalAccountManagement();
      case 'admin-account':
        return renderAdminAccountManagement();
      default:
        return renderNormalAccountManagement();
    }
  };

  // 渲染模态框
  const renderModal = () => {
    if (!showModal) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className={`rounded-xl p-6 shadow-xl max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-xl font-bold mb-4">
            {editingAccount ? '编辑账号' : '创建新账号'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">用户名</label>
              <input
                type="text"
                defaultValue={editingAccount?.username || ''}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                placeholder="请输入用户名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">姓名</label>
              <input
                type="text"
                defaultValue={editingAccount?.name || ''}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                placeholder="请输入姓名"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">角色</label>
              <select
                defaultValue={editingAccount?.role || '普通用户'}
                className={`w-full px-4 py-2 rounded-lg border ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                    : 'bg-white border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
              >
                {activeSection.includes('admin') ? (
                  <>
                    <option value="系统管理员">系统管理员</option>
                    <option value="安全管理员">安全管理员</option>
                  </>
                ) : (
                  <option value="普通用户">普通用户</option>
                )}
              </select>
            </div>
            
            {!editingAccount && (
              <div>
                <label className="block text-sm font-medium mb-1">密码</label>
                <input
                  type="password"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 focus:border-blue-500' 
                      : 'bg-white border-gray-200 focus:border-blue-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all`}
                  placeholder="请设置密码"
                />
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className={`px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } transition-colors`}
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsProcessing(true);
                  setTimeout(() => {
                    setIsProcessing(false);
                    setShowModal(false);
                    toast.success(editingAccount ? '账号已更新' : '账号已创建');
                  }, 800);
                }}
                disabled={isProcessing}
                className={`px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors`}
              >
                {isProcessing ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  editingAccount ? '更新' : '创建'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen relative`}>
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">账号管理</h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            管理系统用户账号与权限
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={logout}
          className={`px-4 py-2 rounded-lg flex items-center ${
            theme === 'dark' 
              ? 'bg-red-900 hover:bg-red-800 text-red-300' 
              : 'bg-red-100 hover:bg-red-200 text-red-800'
          } transition-colors`}
        >
          <i className="fa-solid fa-sign-out-alt mr-2"></i>
          退出登录
        </motion.button>
      </div>
      
      {/* 内容区域 */}
      {renderContent()}
      
      {/* 模态框 */}
      {renderModal()}
    </div>
  );
};

export default AccountManagementSection;