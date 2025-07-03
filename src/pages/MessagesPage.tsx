import React from 'react';
import { Header } from '../components/layout/Header';
import { MessagesList } from '../components/messages/MessagesList';

export const MessagesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-600">Stay connected with your sports network</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <MessagesList />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-slate-200 h-96 flex items-center justify-center shadow-sm">
              <div className="text-center">
                <p className="text-slate-500 mb-4">Select a conversation to start messaging</p>
                <p className="text-sm text-slate-400">Connect with athletes and coordinate your next game</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};