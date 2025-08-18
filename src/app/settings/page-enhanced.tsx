'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { notify } from '@/components/ui/notifications';
import { useLocalStorage } from '@/lib/hooks';
import { 
  Settings, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Download,
  Upload,
  Trash2,
  Moon,
  Sun,
  DollarSign,
  Save,
  RotateCcw,
  Monitor
} from 'lucide-react';

interface UserSettings {
  name: string;
  email: string;
  monthlySalary: number;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    budgetAlerts: boolean;
    taskReminders: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    showBalance: boolean;
    shareAnalytics: boolean;
  };
  display: {
    compactMode: boolean;
    animations: boolean;
    soundEffects: boolean;
  };
}

const defaultSettings: UserSettings = {
  name: 'John Doe',
  email: 'john@example.com',
  monthlySalary: 15000000,
  currency: 'VND',
  language: 'en',
  theme: 'light',
  notifications: {
    email: true,
    push: true,
    budgetAlerts: true,
    taskReminders: true,
    weeklyReports: false,
  },
  privacy: {
    showBalance: true,
    shareAnalytics: false,
  },
  display: {
    compactMode: false,
    animations: true,
    soundEffects: false,
  },
};

export default function SettingsPageEnhanced() {
  const [settings, setSettings] = useLocalStorage<UserSettings>('user-settings', defaultSettings);
  const [activeTab, setActiveTab] = useState('profile');
  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (category: keyof UserSettings, key: string, value: unknown) => {
    setSettings(prev => {
      const updated = { ...prev };
      if (typeof updated[category] === 'object' && updated[category] !== null) {
        (updated[category] as Record<string, unknown>)[key] = value;
      } else {
        (updated as Record<string, unknown>)[category] = value;
      }
      return updated;
    });
    setHasChanges(true);
  };

  const saveSettings = () => {
    // In a real app, this would save to a backend
    notify.success('Settings Saved', 'Your preferences have been updated successfully');
    setHasChanges(false);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    notify.info('Settings Reset', 'All settings have been reset to defaults');
  };

  const exportData = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'settings-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    notify.success('Data Exported', 'Your settings have been downloaded');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'advanced', label: 'Advanced', icon: Settings },
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'auto', label: 'Auto', icon: Monitor },
  ];

  const currencyOptions = [
    { value: 'VND', label: 'Vietnamese Dong (₫)' },
    { value: 'USD', label: 'US Dollar ($)' },
    { value: 'EUR', label: 'Euro (€)' },
    { value: 'GBP', label: 'British Pound (£)' },
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
  ];

  return (
    <div className="space-y-6 content-padding">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text flex items-center">
            <Settings className="h-8 w-8 mr-3" />
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Customize your experience and manage your preferences
          </p>
        </div>
        
        {hasChanges && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={resetSettings}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button onClick={saveSettings} className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 h-fit glass border-0 shadow-lg">
          <CardContent className="p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Input
                      value={settings.name}
                      onChange={(e) => updateSetting('name', '', e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={settings.email}
                      onChange={(e) => updateSetting('email', '', e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Salary
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        value={settings.monthlySalary}
                        onChange={(e) => updateSetting('monthlySalary', '', parseInt(e.target.value) || 0)}
                        placeholder="Enter monthly salary"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                    </label>
                    <select
                      value={settings.currency}
                      onChange={(e) => updateSetting('currency', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {currencyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Language
                    </label>
                    <select
                      value={settings.language}
                      onChange={(e) => updateSetting('language', '', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Appearance & Display</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Theme Preference
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updateSetting('theme', '', option.value)}
                        className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                          settings.theme === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <option.icon className="h-6 w-6 mx-auto mb-2" />
                        <p className="text-sm font-medium">{option.label}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Compact Mode</h4>
                      <p className="text-sm text-gray-500">Reduce spacing and padding for more content</p>
                    </div>
                    <Switch
                      checked={settings.display.compactMode}
                      onCheckedChange={(checked) => updateSetting('display', 'compactMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Animations</h4>
                      <p className="text-sm text-gray-500">Enable smooth transitions and animations</p>
                    </div>
                    <Switch
                      checked={settings.display.animations}
                      onCheckedChange={(checked) => updateSetting('display', 'animations', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Sound Effects</h4>
                      <p className="text-sm text-gray-500">Play sounds for actions and notifications</p>
                    </div>
                    <Switch
                      checked={settings.display.soundEffects}
                      onCheckedChange={(checked) => updateSetting('display', 'soundEffects', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Notifications</h4>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Push Notifications</h4>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Budget Alerts</h4>
                      <p className="text-sm text-gray-500">Get notified when approaching budget limits</p>
                    </div>
                    <Switch
                      checked={settings.notifications.budgetAlerts}
                      onCheckedChange={(checked) => updateSetting('notifications', 'budgetAlerts', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Task Reminders</h4>
                      <p className="text-sm text-gray-500">Reminders for upcoming and overdue tasks</p>
                    </div>
                    <Switch
                      checked={settings.notifications.taskReminders}
                      onCheckedChange={(checked) => updateSetting('notifications', 'taskReminders', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Weekly Reports</h4>
                      <p className="text-sm text-gray-500">Weekly summary of your financial activity</p>
                    </div>
                    <Switch
                      checked={settings.notifications.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('notifications', 'weeklyReports', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Show Balance in Overview</h4>
                      <p className="text-sm text-gray-500">Display account balance on main dashboard</p>
                    </div>
                    <Switch
                      checked={settings.privacy.showBalance}
                      onCheckedChange={(checked) => updateSetting('privacy', 'showBalance', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Share Anonymous Analytics</h4>
                      <p className="text-sm text-gray-500">Help improve the app with anonymous usage data</p>
                    </div>
                    <Switch
                      checked={settings.privacy.shareAnalytics}
                      onCheckedChange={(checked) => updateSetting('privacy', 'shareAnalytics', checked)}
                    />
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Data Management</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button variant="outline" onClick={exportData} className="justify-start">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Settings */}
          {activeTab === 'advanced' && (
            <Card className="glass border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Developer Mode</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        These settings are for advanced users only. Changing them may affect app performance.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Debug Information</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Version:</span>
                        <Badge variant="default">v1.0.0</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Build:</span>
                        <Badge variant="info">2024.1.15</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Environment:</span>
                        <Badge variant="success">Production</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-4 text-red-600">Danger Zone</h4>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => {
                          if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
                            localStorage.clear();
                            notify.warning('Data Cleared', 'All local data has been removed');
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All Data
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
