'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Monitor, Tablet } from 'lucide-react';

interface InstallGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallGuide({ isOpen, onClose }: InstallGuideProps) {
  const [activeTab, setActiveTab] = useState<'mobile' | 'desktop' | 'tablet'>('mobile');

  if (!isOpen) return null;

  const tabs = [
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'tablet', label: 'Tablet', icon: Tablet },
    { id: 'desktop', label: 'Desktop', icon: Monitor },
  ] as const;

  const instructions = {
    mobile: {
      ios: [
        '1. Tap the Share button (square with arrow pointing up)',
        '2. Scroll down and tap "Add to Home Screen"',
        '3. Tap "Add" to confirm',
        '4. The app will now appear on your home screen'
      ],
      android: [
        '1. Tap the three dots menu (⋮) in your browser',
        '2. Select "Add to Home screen" or "Install app"',
        '3. Tap "Add" or "Install" to confirm',
        '4. The app will now appear on your home screen'
      ]
    },
    tablet: {
      ios: [
        '1. Tap the Share button (square with arrow pointing up)',
        '2. Tap "Add to Home Screen"',
        '3. Tap "Add" to confirm',
        '4. The app will now appear on your home screen'
      ],
      android: [
        '1. Tap the three dots menu (⋮) in your browser',
        '2. Select "Add to Home screen" or "Install app"',
        '3. Tap "Add" or "Install" to confirm',
        '4. The app will now appear on your home screen'
      ]
    },
    desktop: {
      chrome: [
        '1. Click the three dots menu (⋮) in the top right',
        '2. Hover over "More tools"',
        '3. Click "Create shortcut..."',
        '4. Check "Open as window" and click "Create"',
        '5. The app will now open in its own window'
      ],
      edge: [
        '1. Click the three dots menu (⋯) in the top right',
        '2. Click "Apps"',
        '3. Click "Install this site as an app"',
        '4. Click "Install" to confirm',
        '5. The app will now open in its own window'
      ],
      firefox: [
        '1. Click the three dots menu (⋯) in the top right',
        '2. Click "Install App"',
        '3. Click "Install" to confirm',
        '4. The app will now open in its own window'
      ]
    }
  };

  const getInstructions = () => {
    if (activeTab === 'desktop') {
      return (
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Google Chrome</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {instructions.desktop.chrome.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Microsoft Edge</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {instructions.desktop.edge.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Mozilla Firefox</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {instructions.desktop.firefox.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">iOS (iPhone/iPad)</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {instructions[activeTab].ios.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Android</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {instructions[activeTab].android.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Install Calvary HPC App
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              Install our app to your device for quick access to sermons, live streams, and more. 
              The app works offline and provides a native-like experience.
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            {getInstructions()}
          </div>

          {/* Benefits */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Benefits of Installing</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Quick access from your home screen</li>
              <li>• Works offline for cached content</li>
              <li>• Faster loading times</li>
              <li>• Native app-like experience</li>
              <li>• Push notifications for updates</li>
            </ul>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="outline">
              Got it
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
