import React, { useState, useEffect } from 'react';
import { Wifi, Thermometer, Droplets, Wind, Users, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

interface IoTSensor {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'occupancy' | 'air_quality' | 'lighting' | 'security';
  value: number;
  unit: string;
  status: 'online' | 'offline' | 'warning';
  lastUpdate: Date;
  location: string;
}

interface IoTDevice {
  id: string;
  name: string;
  type: 'smart_lighting' | 'climate_control' | 'security_camera' | 'access_control';
  status: 'on' | 'off' | 'auto';
  controllable: boolean;
}

export const IoTIntegration: React.FC<{ courtId: string }> = ({ courtId }) => {
  const [sensors, setSensors] = useState<IoTSensor[]>([]);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initialize mock IoT data
    initializeIoTData();
    
    // Simulate real-time updates
    const interval = setInterval(updateSensorData, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeIoTData = () => {
    const mockSensors: IoTSensor[] = [
      {
        id: 'temp_001',
        name: 'مستشعر الحرارة الرئيسي',
        type: 'temperature',
        value: 24.5,
        unit: '°C',
        status: 'online',
        lastUpdate: new Date(),
        location: 'وسط الملعب'
      },
      {
        id: 'hum_001',
        name: 'مستشعر الرطوبة',
        type: 'humidity',
        value: 65,
        unit: '%',
        status: 'online',
        lastUpdate: new Date(),
        location: 'غرفة تغيير الملابس'
      },
      {
        id: 'occ_001',
        name: 'عداد الحضور',
        type: 'occupancy',
        value: 8,
        unit: 'أشخاص',
        status: 'online',
        lastUpdate: new Date(),
        location: 'مدخل الملعب'
      },
      {
        id: 'air_001',
        name: 'جودة الهواء',
        type: 'air_quality',
        value: 85,
        unit: 'AQI',
        status: 'online',
        lastUpdate: new Date(),
        location: 'منطقة الجلوس'
      }
    ];

    const mockDevices: IoTDevice[] = [
      {
        id: 'light_001',
        name: 'إضاءة الملعب الذكية',
        type: 'smart_lighting',
        status: 'auto',
        controllable: true
      },
      {
        id: 'climate_001',
        name: 'نظام التكييف',
        type: 'climate_control',
        status: 'on',
        controllable: true
      },
      {
        id: 'camera_001',
        name: 'كاميرا الأمان',
        type: 'security_camera',
        status: 'on',
        controllable: false
      },
      {
        id: 'access_001',
        name: 'نظام التحكم بالدخول',
        type: 'access_control',
        status: 'on',
        controllable: true
      }
    ];

    setSensors(mockSensors);
    setDevices(mockDevices);
  };

  const updateSensorData = () => {
    setSensors(prev => prev.map(sensor => ({
      ...sensor,
      value: sensor.type === 'temperature' 
        ? Math.max(15, Math.min(35, sensor.value + (Math.random() - 0.5) * 2))
        : sensor.type === 'humidity'
        ? Math.max(30, Math.min(90, sensor.value + (Math.random() - 0.5) * 5))
        : sensor.type === 'occupancy'
        ? Math.max(0, Math.min(20, sensor.value + Math.floor((Math.random() - 0.5) * 3)))
        : sensor.type === 'air_quality'
        ? Math.max(50, Math.min(100, sensor.value + (Math.random() - 0.5) * 10))
        : sensor.value,
      lastUpdate: new Date()
    })));
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case 'temperature': return <Thermometer className="h-5 w-5 text-red-500" />;
      case 'humidity': return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'occupancy': return <Users className="h-5 w-5 text-purple-500" />;
      case 'air_quality': return <Wind className="h-5 w-5 text-emerald-500" />;
      default: return <Zap className="h-5 w-5 text-slate-500" />;
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart_lighting': return '💡';
      case 'climate_control': return '❄️';
      case 'security_camera': return '📹';
      case 'access_control': return '🔐';
      default: return '⚙️';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-600 bg-emerald-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const toggleDevice = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId && device.controllable
        ? { 
            ...device, 
            status: device.status === 'on' ? 'off' : 'on' 
          }
        : device
    ));
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className={`p-4 rounded-lg border ${
        isConnected 
          ? 'bg-emerald-50 border-emerald-200' 
          : 'bg-red-50 border-red-200'
      }`}>
        <div className="flex items-center space-x-3">
          {isConnected ? (
            <CheckCircle className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <div>
            <h3 className={`font-medium ${
              isConnected ? 'text-emerald-900' : 'text-red-900'
            }`}>
              {isConnected ? 'متصل بشبكة إنترنت الأشياء' : 'انقطاع في الاتصال'}
            </h3>
            <p className={`text-sm ${
              isConnected ? 'text-emerald-700' : 'text-red-700'
            }`}>
              {isConnected 
                ? `${sensors.length} مستشعر و ${devices.length} جهاز متصل`
                : 'يتم إعادة المحاولة...'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Sensors Grid */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <Wifi className="h-5 w-5 text-blue-600" />
          <span>المستشعرات المباشرة</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                {getSensorIcon(sensor.type)}
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(sensor.status)}`}>
                  {sensor.status === 'online' ? 'متصل' : 
                   sensor.status === 'offline' ? 'منقطع' : 'تحذير'}
                </span>
              </div>
              
              <h4 className="font-medium text-slate-900 text-sm mb-1">{sensor.name}</h4>
              <p className="text-xs text-slate-500 mb-3">{sensor.location}</p>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">
                  {sensor.value}
                  <span className="text-sm font-normal text-slate-600 ml-1">
                    {sensor.unit}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  آخر تحديث: {sensor.lastUpdate.toLocaleTimeString('ar-SA', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Devices Control */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-purple-600" />
          <span>الأجهزة الذكية</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((device) => (
            <div key={device.id} className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getDeviceIcon(device.type)}</span>
                  <div>
                    <h4 className="font-medium text-slate-900">{device.name}</h4>
                    <p className="text-sm text-slate-600">
                      {device.status === 'on' ? 'مفعل' : 
                       device.status === 'off' ? 'معطل' : 'تلقائي'}
                    </p>
                  </div>
                </div>
                
                {device.controllable && (
                  <button
                    onClick={() => toggleDevice(device.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      device.status === 'on' 
                        ? 'bg-emerald-500' 
                        : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                      device.status === 'on' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environmental Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-6 border border-blue-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">رؤى بيئية ذكية</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">جودة البيئة</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600">ممتازة للرياضة</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              الحرارة والرطوبة في المستوى الأمثل
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">مستوى الازدحام</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-slate-600">متوسط</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              8 أشخاص حالياً في الملعب
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-slate-900 mb-2">توفير الطاقة</h4>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-sm text-slate-600">15% توفير</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              الإضاءة الذكية تعمل بكفاءة
            </p>
          </div>
        </div>
      </div>

      {/* Automation Rules */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">قواعد الأتمتة</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900 text-sm">إضاءة تلقائية</h4>
              <p className="text-xs text-slate-600">تشغيل الإضاءة عند دخول اللاعبين</p>
            </div>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
              <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900 text-sm">تكييف ذكي</h4>
              <p className="text-xs text-slate-600">ضبط الحرارة حسب عدد اللاعبين</p>
            </div>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
              <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium text-slate-900 text-sm">تنبيهات الصيانة</h4>
              <p className="text-xs text-slate-600">إشعار عند الحاجة للصيانة</p>
            </div>
            <div className="w-8 h-4 bg-emerald-500 rounded-full relative">
              <div className="w-3 h-3 bg-white rounded-full absolute top-0.5 right-0.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};