import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTheme } from '@/hooks/useTheme';

interface OverviewSectionProps {
  activeCamera: string;
}

// 模拟生长数据
const generateGrowthData = () => {
  return Array(7).fill(0).map((_, index) => ({
    date: `第${index + 1}天`,
    height: Math.floor(Math.random() * 30) + 10,
    leaves: Math.floor(Math.random() * 10) + 5,
    fruits: Math.floor(Math.random() * 5) + 1
  }));
};

const OverviewSection: React.FC<OverviewSectionProps> = ({ activeCamera }) => {
  const { theme } = useTheme();
  const [growthData, setGrowthData] = useState(generateGrowthData());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟数据刷新
  const refreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setGrowthData(generateGrowthData());
      setIsRefreshing(false);
      toast.success('数据已更新');
    }, 800);
  };

  // 自动刷新数据
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000); // 每30秒刷新一次
    
    return () => clearInterval(interval);
  }, []);

  // 获取当前显示的摄像头信息
  const getCameraInfo = () => {
    if (activeCamera === 'camera-a') {
      return {
        title: 'A区农田监控',
        location: '东部农田区域',
        cropType: '小麦',
        area: '5.2公顷',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Wheat%20field%20aerial%20view%20sunny%20day&sign=089b7eaa7dac06b3b751ee6f3b57af60'
      };
    } else if (activeCamera === 'camera-b') {
      return {
        title: 'B区农田监控',
        location: '南部农田区域',
        cropType: '水稻',
        area: '3.8公顷',
        imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Rice%20paddy%20field%20aerial%20view%20sunset&sign=9ed9293260f124dfdde15d3e2527f28e'
      };
    }
    
    // 默认显示概览
    return {
      title: '农田总览',
      location: '全部区域',
      cropType: '多种作物',
      area: '25.0公顷',
      imageUrl: 'https://space.coze.cn/api/coze_space/gen_image?image_size=landscape_16_9&prompt=Farmland%20aerial%20view%20various%20crops&sign=98b425a5a043a4dd75f5c4cae986cee4'
    };
  };

  const cameraInfo = getCameraInfo();

  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}>
      {/* 顶部标题栏 */}
      <div className="flex justify-between items-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold">{cameraInfo.title}</h2>
          <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            实时监控与数据分析
          </p>
        </motion.div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={refreshData}
          disabled={isRefreshing}
          className={`px-4 py-2 rounded-lg flex items-center ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-100 shadow'
          } transition-colors`}
        >
          {isRefreshing ? (
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>
          ) : (
            <i className="fa-solid fa-sync-alt mr-2"></i>
          )}
          刷新数据
        </motion.button>
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 左侧摄像头画面 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`lg:col-span-2 rounded-xl overflow-hidden shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h3 className="font-semibold">实时监控画面</h3>
            <div className="flex space-x-2">
              <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'} flex items-center`}>
                <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                直播中
              </span>
              <span className={`px-2 py-1 rounded text-xs ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="relative h-96 overflow-hidden">
            <img 
              src={cameraInfo.imageUrl} 
              alt={`${cameraInfo.title}画面`}
              className="w-full h-full object-cover"
            />
            
            {/* 模拟监控界面元素 */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black bg-opacity-50 text-white text-sm flex justify-between items-center">
              <div>
                <p className="font-semibold">{cameraInfo.location}</p>
                <p>作物: {cameraInfo.cropType} | 面积: {cameraInfo.area}</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
                  <i className="fa-solid fa-expand"></i>
                </button>
                <button className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors">
                  <i className="fa-solid fa-cog"></i>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* 右侧数据卡片 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col gap-6"
        >
          {/* 生长数据卡片 */}
          <div className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-semibold mb-4">作物生长数据</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#eee'} />
                  <XAxis dataKey="date" stroke={theme === 'dark' ? '#aaa' : '#666'} />
                  <YAxis stroke={theme === 'dark' ? '#aaa' : '#666'} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: theme === 'dark' ? '#333' : '#fff',
                      borderColor: theme === 'dark' ? '#555' : '#ddd',
                      color: theme === 'dark' ? '#eee' : '#333'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="height" stroke="#10b981" name="高度(cm)" strokeWidth={2} />
                  <Line type="monotone" dataKey="leaves" stroke="#3b82f6" name="叶片数" strokeWidth={2} />
                  <Line type="monotone" dataKey="fruits" stroke="#f59e0b" name="果实数" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* 状态卡片 */}
          <div className={`rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <h3 className="font-semibold mb-4">农田状态</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-green-50'}`}>
                <div className="text-sm mb-1">土壤湿度</div>
                <div className="text-lg font-bold text-green-500">68%</div>
                <div className="text-xs mt-1 flex items-center">
                  <i className="fa-solid fa-check-circle text-green-500 mr-1"></i>
                  正常
                </div>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="text-sm mb-1">光照强度</div>
                <div className="text-lg font-bold text-blue-500">82 klux</div>
                <div className="text-xs mt-1 flex items-center">
                  <i className="fa-solid fa-check-circle text-green-500 mr-1"></i>
                  充足
                </div>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-amber-50'}`}>
                <div className="text-sm mb-1">温度</div>
                <div className="text-lg font-bold text-amber-500">24°C</div>
                <div className="text-xs mt-1 flex items-center">
                  <i className="fa-solid fa-check-circle text-green-500 mr-1"></i>
                  适宜
                </div>
              </div>
              <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-purple-50'}`}>
                <div className="text-sm mb-1">养分含量</div>
                <div className="text-lg font-bold text-purple-500">75%</div>
                <div className="text-xs mt-1 flex items-center">
                  <i className="fa-solid fa-check-circle text-green-500 mr-1"></i>
                  良好
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* 底部信息 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`mt-6 rounded-xl p-5 shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
      >
        <h3 className="font-semibold mb-3">今日种植建议</h3>
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
          根据实时监测数据，{cameraInfo.location}的{cameraInfo.cropType}生长状况良好。未来24小时天气预报显示晴朗，
          建议适当增加灌溉频率，保持土壤湿度在60%-70%之间。同时，建议在明日上午10点进行一次叶面施肥，
          以补充作物生长所需的微量元素。光照充足，无需额外补光措施。
        </p>
      </motion.div>
    </div>
  );
};

export default OverviewSection;