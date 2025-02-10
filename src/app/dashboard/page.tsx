'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityData {
  steps: number;
  calories: number;
  sleepHours: number;
  waterIntake: number;
}

export default function Dashboard() {
  const [activityData, setActivityData] = useState<ActivityData>({
    steps: 0,
    calories: 0,
    sleepHours: 0,
    waterIntake: 0,
  });

  // In a real application, you would fetch this data from your API
  useEffect(() => {
    // Simulated data - replace with actual API call
    setActivityData({
      steps: 8432,
      calories: 1850,
      sleepHours: 7.5,
      waterIntake: 2000,
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Daily Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-indigo-600">{activityData.steps}</p>
            <p className="text-sm text-gray-500">Daily Goal: 10,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">{activityData.calories}</p>
            <p className="text-sm text-gray-500">Daily Goal: 2,000</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sleep</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">{activityData.sleepHours} hrs</p>
            <p className="text-sm text-gray-500">Daily Goal: 8 hrs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-cyan-600">{activityData.waterIntake} ml</p>
            <p className="text-sm text-gray-500">Daily Goal: 2,500 ml</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Morning Walk</span>
                <span className="text-gray-500">30 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Yoga Session</span>
                <span className="text-gray-500">45 mins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Evening Run</span>
                <span className="text-gray-500">20 mins</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nutrition Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Protein</span>
                <span className="text-gray-500">65g / 80g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Carbs</span>
                <span className="text-gray-500">200g / 250g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Fats</span>
                <span className="text-gray-500">45g / 60g</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
