import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

interface PlantingManagementSectionProps {
  activeSection: string;
}

// 模拟历史数据
const generateHistoryData = (type: string) => {
  const labels = ['1月', '2月', '3月', '4月', '5月', '6月'];
  
  switch (type) {
    case 'fertilizer':
      return labels.map(label => ({
        month: label,
        nitrogen: Math.floor(Math.random() * 30) + 10,
        phosphorus: Math.floor(Math.random() * 20) + 5,
        potassium: Math.floor(Math.random() * 25) + 8
      }));
    case 'watering':
      return labels.map(label => ({
        month: label,
        humidity: Math.floor(Math.random() * 40) + 40,
        rainfall: Math.floor(Math.random() * 100) + 20,
        irrigation: Math.floor(Math.random() * 50) + 10
      }));
    case 'lighting':
      return labels.map(label => ({
        month: label,
        intensity: Math.floor(Math.random() * 50) + 50,
        hours: Math.floor(Math.random() * 8) + 8
      }));
    case 'temperature':
      return labels.map(label => ({
        month: label,
        dayTemp: Math.floor(Math.random() * 15) + 20,
        nightTemp: Math.floor(Math.random() * 10) + 10,
        soilTemp: Math.floor(Math.random() * 10) + 15
      }));
    default:
      return labels.map(label => ({ month: label, value: 0 }));
  }
};

// 模拟实时数据
const generateRealtimeData = (type: string) => {
  switch (type) {
    case 'fertilizer':
      return {
        nitrogen: (Math.random() * 10 + 20).toFixed(2),
        phosphorus: (Math.random() * 5 + 8).toFixed(2),
        potassium: (Math.random() * 8 + 12).toFixed(2),
        lastFertilized: '2025-11-20 09:30:00',
        nextRecommended: '2025-11-28 08:00:00'
      };
    case 'watering':
      return {
        humidity: Math.floor(Math.random() * 30) + 50,
        lastWatered: '2025-11-25 06:15:00',
        nextRecommended: '2025-11-26 07:00:00',
        rainfallPrediction: Math.floor(Math.random() * 20)
      };
    case 'lighting':
      return {
        intensity: Math.floor(Math.random() * 50) + 70,
        hoursToday: (Math.random() * 4 + 6).toFixed(1),
        recommended: '10-12小时',
        currentStatus: Math.random() > 0.5 ? '自然光照' : '补光模式'
      };
    case 'temperature':
      return {
        airTemp: (Math.random() * 10 + 20).toFixed(1),
        soilTemp: (Math.random() * 5 + 18).toFixed(1),
        humidity: Math.floor(Math.random() * 20) + 60,
        lastAdjusted: '2025-11-24 15:45:00'
      };
    default:
      return {};
  }
};

// 模拟设备状态数据
const generateDeviceStatus = () => {
  return [
    { name: '灌溉系统', status: Math.random() > 0.1, lastMaintenance: '2025-11-10' },
    { name: '施肥系统', status: Math.random() > 0.1, lastMaintenance: '2025-11-15' },
    { name: '温控系统', status: Math.random() > 0.1, lastMaintenance: '2025-11-05' },
    { name: '补光系统', status: Math.random() > 0.1, lastMaintenance: '2025-11-08' }
  ];
};

const PlantingManagementSection: React.FC<PlantingManagementSectionProps> = ({ activeSection }) => {
  const { theme } = useTheme();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [realtimeData, setRealtimeData] = useState<any>({});
  const [deviceStatus, setDeviceStatus] = useState(generateDeviceStatus());
  const [isProcessing, setIsProcessing] = useState(false);
  const [fertilizerEnabled, setFertilizerEnabled] = useState(false);
  const [wateringEnabled, setWateringEnabled] = useState(false);
  const [lightingEnabled, setLightingEnabled] = useState(false);
  const [temperatureEnabled, setTemperatureEnabled] = useState(false);

  // 初始化和切换区域时加载数据
  useEffect(() => {
    // 提取具体的管理类型
    const type = activeSection === 'planting' ? 'fertilizer' : activeSection;
    setHistoryData(generateHistoryData(type));
    setRealtimeData(generateRealtimeData(type));
    setDeviceStatus(generateDeviceStatus());
    
    // 根据类型设置初始状态
    switch (type) {
      case 'fertilizer':
        setFertilizerEnabled(Math.random() > 0.5);
        break;
      case 'watering':
        setWateringEnabled(Math.random() > 0.5);
        break;
      case 'lighting':
        setLightingEnabled(Math.random() > 0.5);
        break;
      case 'temperature':
        setTemperatureEnabled(Math.random() > 0.5);
        break;
    }
  }, [activeSection]);

  // 处理控制操作
  const handleControlToggle = (type: string, value: boolean) => {
    setIsProcessing(true);
    
    // 模拟操作延迟
    setTimeout(() => {
      setIsProcessing(false);
      
      switch (type) {
        case 'fertilizer':
          setFertilizerEnabled(value);
          toast.success(value ? '施肥系统已开启' : '施肥系统已关闭');
          break;
        case 'watering':
          setWateringEnabled(value);
          toast.success(value ? '灌溉系统已开启' : '灌溉系统已关闭');
          break;
        case 'lighting':
          setLightingEnabled(value);
          toast.success(value ? '补光系统已开启' : '补光系统已关闭');
          break;
        case 'temperature':
          setTemperatureEnabled(value);
          toast.success(value ? '温控系统已开启' : '温控系统已关闭');
          break;
      }
    }, 1000);
  };

  // 渲染施肥管理界面
  const renderFertilizerManagement = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时数据卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">土壤养分实时数据</h3>
            <div className={`flex items-center ${fertilizerEnabled ? 'text-green-500' : 'text-red-500'}`}>
              {fertilizerEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  系统开启
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                  系统关闭
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="text-sm mb-1">氮含量</div>
              <div className="text-2xl font-bold text-blue-500">{realtimeData.nitrogen} mg/kg</div>
              <div className="text-xs mt-1">
                <i className="fa-solid fa-arrow-up text-green-500"></i> 2.4%
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className="text-sm mb-1">磷含量</div>
              <div className="text-2xl font-bold text-yellow-500">{realtimeData.phosphorus} mg/kg</div>
              <div className="text-xs mt-1">
                <i className="fa-solid fa-arrow-down text-red-500"></i> 1.1%
              </div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
              <div className="text-sm mb-1">钾含量</div>
              <div className="text-2xl font-bold text-purple-500">{realtimeData.potassium} mg/kg</div>
              <div className="text-xs mt-1">
                <i className="fa-solid fa-minus text-gray-500"></i> 0%
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>上次施肥时间</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.lastFertilized}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>建议下次施肥时间</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.nextRecommended}
              </span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleControlToggle('fertilizer', !fertilizerEnabled)}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg flex items-center ${
                fertilizerEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
            >
              {isProcessing ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                fertilizerEnabled 
                  ? <i className="fa-solid fa-power-off mr-2"></i> 
                  : <i className="fa-solid fa-play mr-2"></i>
              )}
              {fertilizerEnabled ? '停止施肥' : '开始施肥'}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 历史数据图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">土壤养分历史数据</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
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
                <Bar dataKey="nitrogen" name="氮含量" fill="#3b82f6" />
                <Bar dataKey="phosphorus" name="磷含量" fill="#f59e0b" />
                <Bar dataKey="potassium" name="钾含量" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* 建议说明 */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
            <p className="flex items-start">
              <i className="fa-solid fa-lightbulb mt-0.5 mr-2"></i>
              根据历史数据分析，当前土壤氮含量略低，建议在下次施肥时增加氮肥比例，以促进作物生长。
            </p>
          </div>
        </motion.div>
        
        {/* 设备状态 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}
        >
          <h3 className="font-semibold mb-4">设备状态</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className={theme === 'dark' ? 'border-b border-gray-700' : 'border-b border-gray-200'}>
                  <th className="py-3 px-4 text-left">设备名称</th>
                  <th className="py-3 px-4 text-left">状态</th>
                  <th className="py-3 px-4 text-left">上次维护时间</th>
                  <th className="py-3 px-4 text-left">操作</th>
                </tr>
              </thead>
              <tbody>
                {deviceStatus.map((device, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      theme === 'dark' ? 'border-b border-gray-700 hover:bg-gray-700' : 'border-b border-gray-200 hover:bg-gray-50'
                    } transition-colors`}
                  >
                    <td className="py-3 px-4">{device.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        device.status 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {device.status ? (
                          <>
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                            正常运行
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            需要维护
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {device.lastMaintenance}
                    </td>
                    <td className="py-3 px-4">
                      <button className={`px-2 py-1 text-sm rounded ${
                        theme === 'dark' 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      } transition-colors`}>
                        查看详情
                      </button>
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

  // 渲染浇水管理界面
  const renderWateringManagement = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时数据卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">土壤湿度实时数据</h3>
            <div className={`flex items-center ${wateringEnabled ? 'text-green-500' : 'text-red-500'}`}>
              {wateringEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  系统开启
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                  系统关闭
                </>
              )}
            </div>
          </div>
          
          {/* 湿度仪表盘 */}
          <div className="flex items-center justify-center mb-6">
            <div className={`w-48 h-48 rounded-full border-8 flex items-center justify-center ${
              realtimeData.humidity > 70 
                ? 'border-blue-500' 
                : realtimeData.humidity > 50 
                  ? 'border-green-500' 
                  : 'border-yellow-500'
            }`}>
              <div className="text-center">
                <div className="text-4xl font-bold">{realtimeData.humidity}%</div>
                <div className="text-xs mt-1">土壤湿度</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>上次浇水时间</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.lastWatered}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>建议下次浇水时间</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.nextRecommended}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>24小时降水预测</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.rainfallPrediction} mm
              </span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleControlToggle('watering', !wateringEnabled)}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg flex items-center ${
                wateringEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
            >
              {isProcessing ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                wateringEnabled 
                  ? <i className="fa-solid fa-power-off mr-2"></i> 
                  : <i className="fa-solid fa-play mr-2"></i>
              )}
              {wateringEnabled ? '停止浇水' : '开始浇水'}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 历史数据图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">湿度与灌溉历史数据</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
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
                <Line type="monotone" dataKey="humidity" name="土壤湿度(%)" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="rainfall" name="降雨量(mm)" stroke="#06b6d4" strokeWidth={2} />
                <Line type="monotone" dataKey="irrigation" name="灌溉量(L)" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 建议说明 */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-blue-50 text-blue-800'}`}>
            <p className="flex items-start">
              <i className="fa-solid fa-lightbulb mt-0.5 mr-2"></i>
              根据天气预报，未来24小时降水量较少，建议增加灌溉频率，保持土壤湿度在60%-70%之间。
            </p>
          </div>
        </motion.div>
        
        {/* 灌溉计划 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}
        >
          <h3 className="font-semibold mb-4">灌溉计划</h3>
          <div className="space-y-3">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} flex justify-between items-center`}>
              <div>
                <div className="font-medium">早晨灌溉</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  时间: 每天 06:00-07:00 | 持续时间: 60分钟 | 流量: 20L/min
                </div>
              </div>
              <button className={`px-3 py-1 text-sm rounded ${
                theme === 'dark' 
                  ? 'bg-gray-600 hover:bg-gray-500' 
                  : 'bg-white hover:bg-gray-100 shadow'
              } transition-colors`}>
                编辑
              </button>
            </div>
            
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'} flex justify-between items-center`}>
              <div>
                <div className="font-medium">傍晚灌溉</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  时间: 每天 18:00-19:00 | 持续时间: 45分钟 | 流量: 15L/min
                </div>
              </div>
              <button className={`px-3 py-1 text-sm rounded ${
                theme === 'dark' 
                  ? 'bg-gray-600 hover:bg-gray-500' 
                  : 'bg-white hover:bg-gray-100 shadow'
              } transition-colors`}>
                编辑
              </button>
            </div>
          </div>
          
          {/* 添加计划按钮 */}
          <div className="mt-4 text-right">
            <button className={`px-4 py-2 rounded-lg inline-flex items-center ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-100 shadow'
            } transition-colors`}>
              <i className="fa-solid fa-plus mr-2"></i>
              添加灌溉计划
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // 渲染光照管理界面
  const renderLightingManagement = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时数据卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">光照实时数据</h3>
            <div className={`flex items-center ${lightingEnabled ? 'text-green-500' : 'text-red-500'}`}>
              {lightingEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  系统开启
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                  系统关闭
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'}`}>
              <div className="text-sm mb-1">光照强度</div>
              <div className="text-2xl font-bold text-yellow-500">{realtimeData.intensity} klux</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-orange-50'}`}>
              <div className="text-sm mb-1">今日光照时长</div>
              <div className="text-2xl font-bold text-orange-500">{realtimeData.hoursToday} 小时</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>最佳光照时长</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.recommended}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>当前模式</span>
              <span className={`text-sm ${
                realtimeData.currentStatus === '自然光照' 
                  ? 'text-green-500' 
                  : 'text-blue-500'
              }`}>
                {realtimeData.currentStatus}
              </span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleControlToggle('lighting', !lightingEnabled)}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg flex items-center ${
                lightingEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
            >
              {isProcessing ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                lightingEnabled 
                  ? <i className="fa-solid fa-power-off mr-2"></i> 
                  : <i className="fa-solid fa-play mr-2"></i>
              )}
              {lightingEnabled ? '关闭补光' : '开启补光'}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 历史数据图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">光照历史数据</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
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
                <Line type="monotone" dataKey="intensity" name="光照强度(klux)" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="hours" name="日照时长(小时)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 建议说明 */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-yellow-50 text-yellow-800'}`}>
            <p className="flex items-start">
              <i className="fa-solid fa-lightbulb mt-0.5 mr-2"></i>
              近期日照时长不足，建议在每日16:00-18:00开启补光系统，以保证作物获得足够的光照时间。
            </p>
          </div>
        </motion.div>
        
        {/* 光照分布图 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">一天光照分布</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: '强光照', value: 4 },
                    { name: '中等光照', value: 6 },
                    { name: '弱光照', value: 8 },
                    { name: '无光照', value: 6 }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#f59e0b" />
                  <Cell fill="#fbbf24" />
                  <Cell fill="#fcd34d" />
                  <Cell fill="#4b5563" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
        
        {/* 光照控制计划 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">补光计划</h3>
          <div className="space-y-3">
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'} flex justify-between items-center`}>
              <div>
                <div className="font-medium">傍晚补光</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  时间: 每天 16:00-18:00 | 亮度: 80%
                </div>
              </div>
              <div className="flex space-x-2">
                <button className={`p-1.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-white hover:bg-gray-100 shadow'
                } transition-colors`}>
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button className={`p-1.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-white hover:bg-gray-100 shadow'
                } transition-colors`}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-50'} flex justify-between items-center`}>
              <div>
                <div className="font-medium">阴雨天补光</div>
                <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  条件: 光照强度&lt;50klux | 亮度: 100%
                </div>
              </div>
              <div className="flex space-x-2">
                <button className={`p-1.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-white hover:bg-gray-100 shadow'
                } transition-colors`}>
                  <i className="fa-solid fa-edit"></i>
                </button>
                <button className={`p-1.5 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-600 hover:bg-gray-500' 
                    : 'bg-white hover:bg-gray-100 shadow'
                } transition-colors`}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
          
          {/* 添加计划按钮 */}
          <div className="mt-4 text-right">
            <button className={`px-4 py-2 rounded-lg inline-flex items-center ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-100 shadow'
            } transition-colors`}>
              <i className="fa-solid fa-plus mr-2"></i>
              添加补光计划
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // 渲染温度管理界面
  const renderTemperatureManagement = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时数据卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">温度实时数据</h3>
            <div className={`flex items-center ${temperatureEnabled ? 'text-green-500' : 'text-red-500'}`}>
              {temperatureEnabled ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  系统开启
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                  系统关闭
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-red-50'}`}>
              <div className="text-sm mb-1">空气温度</div>
              <div className="text-2xl font-bold text-red-500">{realtimeData.airTemp}°C</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
              <div className="text-sm mb-1">土壤温度</div>
              <div className="text-2xl font-bold text-blue-500">{realtimeData.soilTemp}°C</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'} col-span-2`}>
              <div className="text-sm mb-1">空气湿度</div>
              <div className="text-2xl font-bold text-purple-500">{realtimeData.humidity}%</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>上次温度调节</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                {realtimeData.lastAdjusted}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>最佳生长温度</span>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                20-25°C
              </span>
            </div>
          </div>
          
          {/* 控制按钮 */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleControlToggle('temperature', !temperatureEnabled)}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg flex items-center ${
                temperatureEnabled 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              } transition-colors`}
            >
              {isProcessing ? (
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              ) : (
                temperatureEnabled 
                  ? <i className="fa-solid fa-power-off mr-2"></i> 
                  : <i className="fa-solid fa-play mr-2"></i>
              )}
              {temperatureEnabled ? '关闭温控' : '开启温控'}
            </motion.button>
          </div>
        </motion.div>
        
        {/* 历史数据图表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}transition={{ duration: 0.5, delay: 0.2 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <h3 className="font-semibold mb-4">温度历史数据</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData}>
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
                <Line type="monotone" dataKey="dayTemp" name="白天温度(°C)" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="nightTemp" name="夜晚温度(°C)" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="soilTemp" name="土壤温度(°C)" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* 建议说明 */}
          <div className={`mt-4 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-red-50 text-red-800'}`}>
            <p className="flex items-start">
              <i className="fa-solid fa-lightbulb mt-0.5 mr-2"></i>
              夜间温度偏低，建议开启保温系统，将夜间温度维持在15°C以上，以促进作物根系生长。
            </p>
          </div>
        </motion.div>
        
        {/* 温度控制策略 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} lg:col-span-2`}
        >
          <h3 className="font-semibold mb-4">温度控制策略</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-2">白天模式 (06:00-18:00)</h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  当温度低于20°C时，开启加热系统
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  当温度高于25°C时，开启通风系统
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  湿度保持在60%-70%之间
                </li>
              </ul>
            </div>
            
            <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h4 className="font-medium mb-2">夜间模式 (18:00-06:00)</h4>
              <ul className={`space-y-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  当温度低于15°C时，开启保温系统
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  湿度保持在70%-80%之间
                </li>
                <li className="flex items-start">
                  <i className="fa-solid fa-circle-check text-green-500 mt-0.5 mr-2"></i>
                  定期通风以保持空气流通
                </li>
              </ul>
            </div>
          </div>
          
          {/* 编辑策略按钮 */}
          <div className="mt-4 text-right">
            <button className={`px-4 py-2 rounded-lg inline-flex items-center ${
              theme === 'dark' 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-white hover:bg-gray-100 shadow'
            } transition-colors`}>
              <i className="fa-solid fa-cog mr-2"></i>
              编辑控制策略
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  // 根据当前激活的区域渲染对应内容
  const renderContent = () => {
    const type = activeSection === 'planting' ? 'fertilizer' : activeSection;
    
    switch (type) {
      case 'fertilizer':
        return renderFertilizerManagement();
      case 'watering':
        return renderWateringManagement();
      case 'lighting':
        return renderLightingManagement();
      case 'temperature':
        return renderTemperatureManagement();
      default:
        return renderFertilizerManagement();
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
          <h2 className="text-2xl font-bold">种植管理</h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            实时监控和控制种植环境参数
          </p>
        </motion.div>
      </div>
      
      {/* 内容区域 */}
      {renderContent()}
    </div>
  );
};

export default PlantingManagementSection;