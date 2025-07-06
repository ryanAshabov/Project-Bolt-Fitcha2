/**
 * Simple Create Game Test Page
 */
import React from 'react';
import { Trophy, Heart, Gamepad2, Brain, Music, Users } from 'lucide-react';

const CreateGameTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
            Create Your Game
          </h1>
          <p className="text-slate-600 text-lg">
            Choose your activity and start playing!
          </p>
        </div>

        {/* Activity Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Sports */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                <Trophy className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Sports & Athletics</h3>
            </div>
            <p className="text-slate-600 mb-4">Basketball, Football, Tennis, Swimming and more</p>
            <div className="flex flex-wrap gap-2">
              {['Basketball', 'Football', 'Tennis', 'Swimming'].map((sport) => (
                <span key={sport} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {sport}
                </span>
              ))}
            </div>
          </div>

          {/* Wellness */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Wellness & Fitness</h3>
            </div>
            <p className="text-slate-600 mb-4">Yoga, Pilates, Meditation, Gym workouts</p>
            <div className="flex flex-wrap gap-2">
              {['Yoga', 'Pilates', 'Gym', 'Meditation'].map((activity) => (
                <span key={activity} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {/* Gaming */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white">
                <Gamepad2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Gaming & Esports</h3>
            </div>
            <p className="text-slate-600 mb-4">Video games, Board games, Chess, Poker</p>
            <div className="flex flex-wrap gap-2">
              {['Video Games', 'Chess', 'Poker', 'Board Games'].map((game) => (
                <span key={game} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {game}
                </span>
              ))}
            </div>
          </div>

          {/* Mental */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Mental & Brain</h3>
            </div>
            <p className="text-slate-600 mb-4">Study groups, Book clubs, Trivia nights</p>
            <div className="flex flex-wrap gap-2">
              {['Study Group', 'Book Club', 'Trivia', 'Debate'].map((activity) => (
                <span key={activity} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                  {activity}
                </span>
              ))}
            </div>
          </div>

          {/* Creative */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white">
                <Music className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Creative & Arts</h3>
            </div>
            <p className="text-slate-600 mb-4">Music, Art, Photography, Writing</p>
            <div className="flex flex-wrap gap-2">
              {['Music', 'Art', 'Photography', 'Writing'].map((art) => (
                <span key={art} className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                  {art}
                </span>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Social & Networking</h3>
            </div>
            <p className="text-slate-600 mb-4">Coffee meetups, Networking events</p>
            <div className="flex flex-wrap gap-2">
              {['Coffee', 'Networking', 'Dinner', 'Workshop'].map((social) => (
                <span key={social} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                  {social}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-green-800 mb-2">✅ Create Game Page Working!</h2>
          <p className="text-green-700">
            This is a simplified test version of the Enhanced Create Game Page. 
            All 6 activity categories are displayed correctly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateGameTest;
