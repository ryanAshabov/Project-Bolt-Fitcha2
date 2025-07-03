import React from 'react';
import { Header } from '../components/layout/Header';
import { mockUsers } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Plus, MapPin, Badge } from 'lucide-react';

export const NetworkPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">My Network</h1>
          <p className="text-slate-600">Connect with professionals in your industry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockUsers.map((user) => (
            <div key={user.id} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
              <div className="text-center">
                <img
                  src={user.avatar}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <h3 className="font-semibold text-slate-900">
                    {user.firstName} {user.lastName}
                  </h3>
                  {user.verified && (
                    <Badge className="h-4 w-4 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-2">{user.headline}</p>
                <div className="flex items-center justify-center text-sm text-slate-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  {user.location}
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mb-4">
                  <span>{user.connections} connections</span>
                  <span className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                  <span>{user.isOnline ? 'Online' : 'Offline'}</span>
                </div>
                <Button className="w-full">
                  <Plus className="h-4 w-4" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};