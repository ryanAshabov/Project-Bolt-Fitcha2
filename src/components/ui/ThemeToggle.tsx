import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Listbox } from '@headlessui/react';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: 'light', name: 'Light', icon: Sun },
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor },
  ];

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Theme</span>
      <Listbox value={theme} onChange={(value) => setTheme(value as 'light' | 'dark' | 'system')}>
        <div className="relative">
          <Listbox.Button className="relative flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            {theme === 'light' && <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
            {theme === 'dark' && <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
            {theme === 'system' && <Monitor className="h-5 w-5 text-slate-600 dark:text-slate-300" />}
            <span className="text-sm text-slate-700 dark:text-slate-300">{themes.find(t => t.id === theme)?.name}</span>
          </Listbox.Button>
          <Listbox.Options className="absolute right-0 mt-1 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
            {themes.map((themeOption) => (
              <Listbox.Option
                key={themeOption.id}
                value={themeOption.id}
                className={({ active }) =>
                  `${
                    active ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'
                  } cursor-pointer select-none relative py-2 px-4`
                }
              >
                {({ selected }) => (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <themeOption.icon className="h-4 w-4 mr-2" />
                      <span className={`${selected ? 'font-medium' : 'font-normal'}`}>
                        {themeOption.name}
                      </span>
                    </div>
                    {selected && (
                      <span className="text-blue-600 dark:text-blue-400">
                        ✓
                      </span>
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};