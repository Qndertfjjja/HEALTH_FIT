'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Activity, Moon, Utensils, LineChart, Heart } from 'lucide-react';

export default function HealthActivity() {
  const [activeTab, setActiveTab] = useState('activities');

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 flex items-center gap-2">
              <Heart className="h-8 w-8 text-green-600" />
              Health Activity Tracking
            </h1>
            <p className="mt-2 text-green-600">Monitor and improve your daily wellness journey</p>
          </div>
          {/* <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <LineChart className="mr-2 h-4 w-4" />
            View Analytics
          </button> */}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="grid grid-cols-3 w-full max-w-2xl mx-auto bg-green-50 p-1 rounded-lg gap-1">
            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'activities'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-green-100 text-green-600'
              }`}
            >
              <Activity className="mr-2 h-4 w-4" />
              Activities
            </button>
            <button
              onClick={() => setActiveTab('sleep')}
              className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'sleep'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-green-100 text-green-600'
              }`}
            >
              <Moon className="mr-2 h-4 w-4" />
              Sleep
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`flex items-center justify-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'nutrition'
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-green-100 text-green-600'
              }`}
            >
              <Utensils className="mr-2 h-4 w-4" />
              Nutrition
            </button>
          </div>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Daily Activities</h3>
              <p className="text-green-600">Track your workouts, steps, and physical activities</p>
              <Link 
                href="/health-activity/activities" 
                className="w-full inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Moon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Sleep Tracking</h3>
              <p className="text-green-600">Monitor your sleep patterns and quality</p>
              <Link 
                href="/health-activity/sleep" 
                className="w-full inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Track Sleep
              </Link>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Utensils className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-green-800">Nutrition Log</h3>
              <p className="text-green-600">Record your meals and track nutritional intake</p>
              <Link 
                href="/health-activity/nutrition" 
                className="w-full inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center"
              >
                Log Meals
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}