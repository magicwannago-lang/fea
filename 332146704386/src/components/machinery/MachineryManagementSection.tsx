import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/hooks/useTheme';

interface MachineryManagementSectionProps {
  activeSection: string;
}

// 模拟机械状态数据
const generateMachineryStatus = () => {
  return [
    { id: 1, name: '播种机', status: 'idle', lastUsed: '2025-11-20 09:30:00', nextMaintenance: '2025-12-10', location: '仓库A区' },
    { id: 2, name: '收割机', status: 'maintenance', lastUsed: '2025-11-15 14:20:00', nextMaintenance: '2025-11-26', location: '维修车间' },
    { id: 3, name: '拖拉机', status: 'working', lastUsed: '2025-11-25 08:15:00', nextMaintenance: '2025-12-05', location: '农田B区' },
    { id: 4, name: '施肥机', status: 'working', lastUsed: '2025-11-24 16:45:00', nextMaintenance: '2025-12-01', location: '农田A区' },
    { id: 5, name: '灌溉设备', status: 'idle', lastUsed: '2025-11-25 06:00:00', nextMaintenance: '2025-11-30', location: '农田C区' }
  ];
};

// 模拟化肥库存数据
const generateFertilizerStock = () => {
  return [
    { id: 1, name: '氮肥', type: 'N', currentStock: 250, totalCapacity: 500, unit: 'kg', lastRefilled: '2025-11-10' },
    { id: 2, name: '磷肥', type: 'P', currentStock: 180, totalCapacity: 400, unit: 'kg', lastRefilled: '2025-11-05' },
    { id: 3, name: '钾肥', type: 'K', currentStock: 320, totalCapacity: 500, unit: 'kg', lastRefilled: '2025-11-15' },
    { id: 4, name: '复合肥', type: 'NPK', currentStock: 120, totalCapacity: 300, unit: 'kg', lastRefilled: '2025-11-01' }
  ];
};

// 模拟化肥使用历史数据
const generateFertilizerUsageHistory = () => {
  return [
    { month: '1月', N: 50, P: 30, K: 40, NPK: 20 },
    { month: '2月', N: 60, P: 35, K: 45, NPK: 25 },
    { month: '3月', N: 70, P: 40, K: 50, NPK: 30 },
    { month: '4月', N: 90, P: 60, K: 70, NPK: 45 },
    { month: '5月', N: 120, P: 80, K: 100, NPK: 60 },
    { month: '6月', N: 100, P: 70, K: 80, NPK: 50 }
  ];
};

const MachineryManagementSection: React.FC<MachineryManagementSectionProps> = ({ activeSection }) => {
  const { theme } = useTheme();
  const [machineryStatus, setMachineryStatus] = useState(generateMachineryStatus());
  const [fertilizerStock, setFertilizerStock] = useState(generateFertilizerStock());
  const [fertilizerUsageHistory, setFertilizerUsageHistory] = useState(generateFertilizerUsageHistory());
  const [isProcessing, setIsProcessing] = useState(false);

  // 渲染机械状态管理界面
  const renderMachineryManagement = () => {
    // 获取状态统计
    const statusCount = machineryStatus.reduce((acc, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const statusData = [
      { name: '运行中', value: statusCount.working || 0, color: '#10b981' },
      { name: '闲置', value: statusCount.idle || 0, color: '#3b82f6' },
      { name: '维护中', value: statusCount.maintenance || 0, color: '#f59e0b' }
    ];

    // 处理机械操作
    const handleMachineryAction = (id: number, action: string) => {
      setIsProcessing(true);
      
      // 模拟操作延迟
      setTimeout(() => {
        setIsProcessing(false);
        
        let message = '';
        switch (action) {
          case 'start':
            setMachineryStatus(prev => prev.map(m => 
              m.id === id ? { ...m, status: 'working' } : m
            ));
            message = '机械已启动';
            break;
          case 'stop':
            setMachineryStatus(prev => prev.map(m => 
              m.id === id ? { ...m, status: 'idle' } : m
            ));
            message = '机械已停止';
            break;
          case 'maintain':
            setMachineryStatus(prev => prev.map(m => 
              m.id === id ? { ...m, status: 'maintenance' } : m
            ));
            message = '已安排维护';
            break;
        }
        
        toast.success(message);
      }, 800);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 机械状态概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">机械状态概览</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 space-y-2">
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}: {item.value} 台</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* 机械位置分布 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">机械位置分布</h3>
          
          <div className="relative h-64 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            {/* 模拟地图背景 */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded border-2 border-blue-500 flex items-center justify-center text-xs">农田A区</div>
              <div className="absolute top-1/3 right-1/4 w-16 h-16 rounded border-2 border-green-500 flex items-center justify-center text-xs">农田B区</div>
              <div className="absolute bottom-1/4 left-1/3 w-16 h-16 rounded border-2 border-yellow-500 flex items-center justify-center text-xs">农田C区</div>
              <div className="absolute top-1/2 right-1/3 w-12 h-12 rounded border-2 border-red-500 flex items-center justify-center text-xs">维修车间</div>
              <div className="absolute bottom-1/3 right-1/5 w-12 h-12 rounded border-2 border-purple-500 flex items-center justify-center text-xs">仓库A区</div>
            </div>
            
            {/* 机械图标 */}
            {machineryStatus.map((machine, index) => {
              let position = { top: '0%', left: '0%' };
              let color = '#666';
              
              // 根据位置设置图标位置
              switch (machine.location) {
                case '农田A区':
                  position = { top: '15%', left: '20%' };
                  break;
                case '农田B区':
                  position = { top: '25%', left: '70%' };
                  break;
                case '农田C区':
                  position = { top: '65%', left: '30%' };
                  break;
                case '维修车间':
                  position = { top: '45%', left: '65%' };
                  break;
                case '仓库A区':
                  position = { top: '60%', left: '80%' };
                  break;
              }
              
              // 根据状态设置图标颜色
              switch (machine.status) {
                case 'working':
                  color = '#10b981';
                  break;
                case 'idle':
                  color = '#3b82f6';
                  break;
                case 'maintenance':
                  color = '#f59e0b';
                  break;
              }
              
              return (
                <motion.div
                  key={machine.id}
                  className="absolute cursor-pointer"
                  style={{ ...position, color }}
                  whileHover={{ scale: 1.2 }}
                  title={machine.name}
                >
                  <i className="fa-solid fa-tractor text-xl"></i>
                </motion.div>
              );
            })}
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="flex items-center">
              <i className="fa-solid fa-tractor mr-2 text-green-500"></i>
              <span className="text-xs">运行中</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-tractor mr-2 text-blue-500"></i>
              <span className="text-xs">闲置</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-tractor mr-2 text-yellow-500"></i>
              <span className="text-xs">维护中</span>
            </div>
            <div className="flex items-center">
              <i className="fa-solid fa-map-marker-alt mr-2 text-red-500"></i>
              <span className="text-xs">点击查看详情</span>
            </div>
          </div>
        </motion.div>
        
        {/* 最近维护提醒 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">近期维护提醒</h3>
          
          <div className="space-y-3">
            {machineryStatus
              .sort((a, b) => new Date(a.nextMaintenance).getTime() - new Date(b.nextMaintenance).getTime())
              .slice(0, 3)
              .map((machine) => (
                <div key={machine.id} className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className="font-medium">{machine.name}</div>
                  <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    维护日期: {machine.nextMaintenance}
                  </div>
                  <div className={`text-xs mt-1 ${
                    new Date(machine.nextMaintenance).getTime() - new Date().getTime() < 86400000 * 3
                      ? 'text-red-500'
                      : 'text-gray-500'
                  }`}>
                    {new Date(machine.nextMaintenance).getTime() - new Date().getTime() < 86400000 * 3
                      ? '即将到期'
                      : '正常'}
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
              查看全部维护计划
            </button>
          </div>
        </motion.div>
        
        {/* 机械列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-3`}
        >
          <h3 className="font-semibold mb-4">机械详细列表</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className="py-3 px-4 text-left">机械名称</th>
                  <th className="py-3 px-4 text-left">状态</th>
                  <th className="py-3 px-4 text-left">位置</th>
                  <th className="py-3 px-4 text-left">上次使用</th>
                  <th className="py-3 px-4 text-left">下次维护</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {machineryStatus.map((machine) => (
                  <tr 
                    key={machine.id} 
                    className={`${
                      theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="py-3 px-4">{machine.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        machine.status === 'working' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : machine.status === 'idle'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}>
                        {machine.status === 'working' ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                            运行中
                          </>
                        ) : machine.status === 'idle' ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></span>
                            闲置
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5"></span>
                            维护中
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">{machine.location}</td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {machine.lastUsed}
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {machine.nextMaintenance}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        {machine.status !== 'working' ? (
                          <button 
                            onClick={() => handleMachineryAction(machine.id, 'start')}
                            disabled={isProcessing}
                            className={`px-2 py-1 text-xs rounded ${
                              theme === 'dark' 
                                ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                            } transition-colors`}
                          >
                            {isProcessing ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-play"></i>
                            )}
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleMachineryAction(machine.id, 'stop')}
                            disabled={isProcessing}
                            className={`px-2 py-1 text-xs rounded ${
                              theme === 'dark' 
                                ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                                : 'bg-red-100 hover:bg-red-200 text-red-800'
                            } transition-colors`}
                          >
                            {isProcessing ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-stop"></i>
                            )}
                          </button>
                        )}
                        
                        {machine.status !== 'maintenance' ? (
                          <button 
                            onClick={() => handleMachineryAction(machine.id, 'maintain')}
                            disabled={isProcessing}
                            className={`px-2 py-1 text-xs rounded ${
                              theme === 'dark' 
                                ? 'bg-yellow-900 hover:bg-yellow-800 text-yellow-300' 
                                : 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800'
                            } transition-colors`}
                          >
                            {isProcessing ? (
                              <i className="fa-solid fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fa-solid fa-tools"></i>
                            )}
                          </button>
                        ) : null}
                        
                        <button className={`px-2 py-1 text-xs rounded ${
                          theme === 'dark' 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-100 hover:bg-gray-200'
                        } transition-colors`}>
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  // 渲染化肥库存管理界面
  const renderFertilizerStockManagement = () => {
    // 计算总库存和总容量
    const totalStock = fertilizerStock.reduce((sum, item) => sum + item.currentStock, 0);
    const totalCapacity = fertilizerStock.reduce((sum, item) => sum + item.totalCapacity, 0);
    const stockPercentage = Math.round((totalStock / totalCapacity) * 100);

    // 处理补料操作
    const handleRefill = (id: number) => {
      setIsProcessing(true);
      
      // 模拟操作延迟
      setTimeout(() => {
        setIsProcessing(false);
        setFertilizerStock(prev => prev.map(item => 
          item.id === id 
            ? { 
                ...item, 
                currentStock: item.totalCapacity,
                lastRefilled: new Date().toISOString().slice(0, 10)
              } 
            : item
        ));
        toast.success('化肥已补充');
      }, 800);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 化肥库存概览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">化肥库存概览</h3>
          
          {/* 库存进度条 */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm">总库存</span>
              <span className="text-sm font-medium">{stockPercentage}%</span>
            </div>
            <div className={`h-3 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  stockPercentage > 70 
                    ? 'bg-green-500' 
                    : stockPercentage > 30 
                      ? 'bg-yellow-500' 
                      : 'bg-red-500'
                }`}
                style={{ width: `${stockPercentage}%` }}
              ></div>
            </div>
            <div className={`text-xs text-right mt-1 ${
              stockPercentage < 30 
                ? 'text-red-500' 
                : theme === 'dark' 
                  ? 'text-gray-400' 
                  : 'text-gray-600'
            }`}>
              {stockPercentage < 30 && '库存不足，需要补充'}
            </div>
          </div>
          
          {/* 详细数据 */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">当前库存总量</span>
              <span className="font-medium">{totalStock} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">总容量</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalCapacity} kg
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">可用空间</span>
              <span className={`font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {totalCapacity - totalStock} kg
              </span>
            </div>
          </div>
          
          {/* 快速操作 */}
          <div className="mt-5 flex justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-white hover:bg-gray-100 shadow'
              } transition-colors`}
            >
              <i className="fa-solid fa-file-alt mr-1"></i>
              导出报告
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
              className={`px-3 py-1.5 text-sm rounded-lg flex items-center ${
                theme === 'dark' 
                  ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                  : 'bg-green-100 hover:bg-green-200 text-green-800'
              } transition-colors`}
            >
              <i className="fa-solid fa-plus mr-1"></i>
              申请补充
            </motion.button>
          </div>
        </motion.div>
        
        {/* 化肥使用趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">化肥使用趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fertilizerUsageHistory}>
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
                <Bar dataKey="N" name="氮肥(kg)" fill="#3b82f6" />
                <Bar dataKey="P" name="磷肥(kg)" fill="#f59e0b" />
                <Bar dataKey="K" name="钾肥(kg)" fill="#8b5cf6" />
                <Bar dataKey="NPK" name="复合肥(kg)" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* 趋势分析 */}
          <div className={`mt-3 p-3 rounded-lg text-xs ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
            <p>分析显示，4-5月是化肥使用高峰期，建议在3月底前完成所有化肥的补充工作，以应对种植旺季的需求。</p>
          </div>
        </motion.div>
        
        {/* 库存预警 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">库存预警</h3>
          
          <div className="space-y-3">
            {fertilizerStock
              .filter(item => (item.currentStock / item.totalCapacity) * 100 < 50)
              .map((item) => {
                const percentage = Math.round((item.currentStock / item.totalCapacity) * 100);
                
                return (
                  <div key={item.id} className={`p-3 rounded-lg ${
                    percentage < 20 
                      ? theme === 'dark' ? 'bg-red-900 bg-opacity-20' : 'bg-red-50' 
                      : theme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'
                  }`}>
                    <div className="font-medium">{item.name}</div>
                    <div className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      剩余: {item.currentStock} kg / {item.totalCapacity} kg
                    </div>
                    <div className={`h-1.5 mt-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                      <div 
                        className={`h-full rounded-full ${
                          percentage < 20 ? 'bg-red-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
              
              {fertilizerStock.every(item => (item.currentStock / item.totalCapacity) * 100 >= 50) && (
                <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'}`}>
                  <i className="fa-solid fa-check-circle text-green-500 text-xl mb-2"></i>
                  <div className="text-sm">所有化肥库存充足</div>
                </div>
              )}
          </div>
        </motion.div>
        
        {/* 化肥详细列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-3`}
        >
          <h3 className="font-semibold mb-4">化肥库存详细列表</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className="py-3 px-4 text-left">化肥名称</th>
                  <th className="py-3 px-4 text-left">类型</th>
                  <th className="py-3 px-4 text-left">当前库存</th>
                  <th className="py-3 px-4 text-left">总容量</th>
                  <th className="py-3 px-4 text-left">库存状态</th>
                  <th className="py-3 px-4 text-left">上次补充</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {fertilizerStock.map((fertilizer) => {
                  const percentage = Math.round((fertilizer.currentStock / fertilizer.totalCapacity) * 100);
                  
                  return (
                    <tr 
                      key={fertilizer.id} 
                      className={`${
                        theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                      } transition-colors`}
                    >
                      <td className="py-3 px-4">{fertilizer.name}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          fertilizer.type === 'N' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' 
                            : fertilizer.type === 'P'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                              : fertilizer.type === 'K'
                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        }`}>
                          {fertilizer.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{fertilizer.currentStock} {fertilizer.unit}</td>
                      <td className="py-3 px-4">{fertilizer.totalCapacity} {fertilizer.unit}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            percentage > 70 
                              ? 'bg-green-500' 
                              : percentage > 30 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}></div>
                          <span className="text-sm">{percentage}%</span>
                        </div>
                      </td>
                      <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {fertilizer.lastRefilled}
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          onClick={() => handleRefill(fertilizer.id)}
                          disabled={isProcessing || fertilizer.currentStock === fertilizer.totalCapacity}
                          className={`px-3 py-1 text-xs rounded ${
                            fertilizer.currentStock === fertilizer.totalCapacity
                              ? theme === 'dark' ? 'bg-gray-700 cursor-not-allowed' : 'bg-gray-100 cursor-not-allowed'
                              : theme === 'dark' 
                                ? 'bg-green-900 hover:bg-green-800 text-green-300' 
                                : 'bg-green-100 hover:bg-green-200 text-green-800'
                          } transition-colors`}
                        >
                          {isProcessing ? (
                            <i className="fa-solid fa-spinner fa-spin"></i>
                          ) : fertilizer.currentStock === fertilizer.totalCapacity ? (
                            <i className="fa-solid fa-check"></i>
                          ) : (
                            <i className="fa-solid fa-plus"></i>
                          )}
                          {fertilizer.currentStock === fertilizer.totalCapacity ? '已充满' : '补充'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  // 根据当前激活的区域渲染对应内容
  const renderContent = () => {
    const type = activeSection === 'machinery' ? 'planting-machine' : activeSection;
    
    switch (type) {
      case 'planting-machine':
        return renderMachineryManagement();
      case 'fertilizer-storage':
        return renderFertilizerStockManagement();
      default:
        return renderMachineryManagement();
    }
  };

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* 顶部标题栏 */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">机械管理</h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            监控和管理农业机械设备与化肥库存
          </p>
        </motion.div>
      </div>
      
      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default MachineryManagementSection;