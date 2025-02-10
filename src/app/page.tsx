'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Moon, Droplets, Flame, Utensils, Timer, Brain, Dumbbell, ChevronRight } from 'lucide-react';

interface ActivityData {
  steps: number;
  calories: number;
  sleepHours: number;
  waterIntake: number;
}

interface NutritionRecord {
  mealType: string;
  totalCalories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface SleepRecord {
  startTime: Date;
  endTime: Date;
  quality: string;
  duration: number;
}

interface AIRecommendation {
  workoutPlan: {
    title: string;
    description: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      duration?: string;
    }>;
  };
  dietPlan: {
    title: string;
    description: string;
    meals: Array<{
      type: string;
      suggestions: string[];
      nutrients: {
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
      };
    }>;
  };
}

export default function Home() {
  const router = useRouter();
  const [activityData, setActivityData] = useState<ActivityData>({
    steps: Math.floor(Math.random() * 10000),
    calories: Math.floor(Math.random() * 3000),
    sleepHours: Math.floor(Math.random() * 10),
    waterIntake: Math.floor(Math.random() * 3000),
  });
  const [nutritionRecords, setNutritionRecords] = useState<NutritionRecord[]>([]);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation | null>({
    workoutPlan: {
      title: "Full Body Strength",
      description: "A balanced workout to build strength and endurance.",
      exercises: [
        { name: "Push-ups", sets: 3, reps: 12 },
        { name: "Squats", sets: 3, reps: 15 },
        
      ]
    },
    dietPlan: {
      title: "2000 Calorie Diet",
      description: "A balanced diet plan to maintain energy levels.",
      meals: [
        {
          type: "Breakfast",
          suggestions: ["Oatmeal with fruits", "Greek yogurt", "Smoothie"],
          nutrients: { calories: 500, protein: 20, carbs: 60, fats: 20 }
        },
        {
          type: "Lunch",
          suggestions: ["Grilled chicken salad", "Quinoa bowl", "Turkey sandwich"],
          nutrients: { calories: 700, protein: 30, carbs: 80, fats: 25 }
        },
        {
          type: "Dinner",
          suggestions: ["Salmon with veggies", "Beef stir-fry", "Vegetable curry"],
          nutrients: { calories: 800, protein: 35, carbs: 70, fats: 30 }
        }
      ]
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [activityResponse, nutritionResponse, sleepResponse, aiResponse] = await Promise.all([
          fetch('/api/user/activities', { headers }),
          fetch('/api/user/nutrition', { headers }),
          fetch('/api/user/sleep', { headers }),
          fetch('/api/ai/recommendations')
        ]);

        if (activityResponse.ok) {
          const data = await activityResponse.json();
          setActivityData({
            steps: Math.floor(Math.random() * 10000),
            calories: Math.floor(Math.random() * 3000),
            sleepHours: Math.floor(Math.random() * 10),
            waterIntake: Math.floor(Math.random() * 3000),
          });
        }

        if (nutritionResponse.ok) {
          const nutritionData = await nutritionResponse.json();
          setNutritionRecords(nutritionData);
        }

        if (sleepResponse.ok) {
          const sleepData = await sleepResponse.json();
          setSleepRecords(sleepData);
        }

        if (aiResponse.ok) {
          const recommendations = await aiResponse.json();
          setAiRecommendations(recommendations);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-green-100 rounded-lg">
            <Activity className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-800">Daily Overview</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Steps Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Timer className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Steps</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{activityData.steps.toLocaleString()}</p>
            <div className="flex items-center text-green-700">
              <div className="h-2 bg-green-100 rounded-full flex-grow">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((activityData.steps / 10000) * 100, 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm">/ 10,000</span>
            </div>
          </div>

          {/* Calories Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Flame className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Calories</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{activityData.calories.toLocaleString()}</p>
            <div className="flex items-center text-green-700">
              <div className="h-2 bg-green-100 rounded-full flex-grow">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((activityData.calories / 2000) * 100, 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm">/ 2,000</span>
            </div>
          </div>

          {/* Sleep Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Moon className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Sleep</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{activityData.sleepHours} hrs</p>
            <div className="flex items-center text-green-700">
              <div className="h-2 bg-green-100 rounded-full flex-grow">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((activityData.sleepHours / 8) * 100, 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm">/ 8 hrs</span>
            </div>
          </div>

          {/* Water Intake Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Droplets className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Water Intake</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{activityData.waterIntake} ml</p>
            <div className="flex items-center text-green-700">
              <div className="h-2 bg-green-100 rounded-full flex-grow">
                <div 
                  className="h-2 bg-green-500 rounded-full" 
                  style={{ width: `${Math.min((activityData.waterIntake / 2500) * 100, 100)}%` }}
                />
              </div>
              <span className="ml-3 text-sm">/ 2,500 ml</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activities Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Recent Activities</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Morning Walk', duration: '30 mins', time: '7:00 AM' },
                { name: 'Yoga Session', duration: '45 mins', time: '9:00 AM' },
                { name: 'Evening Run', duration: '20 mins', time: '6:00 PM' },
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Timer className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{activity.name}</p>
                      <p className="text-sm text-green-600">{activity.time}</p>
                    </div>
                  </div>
                  <span className="text-green-700 font-medium">{activity.duration}</span>
                </div>
              ))}
            </div>
          </div>



          {/* Nutrition Summary Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <Utensils className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800">Nutrition Summary</h3>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Protein', current: 65, goal: 80, unit: 'g' },
                { name: 'Carbs', current: 200, goal: 250, unit: 'g' },
                { name: 'Fats', current: 45, goal: 60, unit: 'g' },
              ].map((nutrient, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-green-800">{nutrient.name}</span>
                    <span className="text-green-700">
                      {nutrient.current}{nutrient.unit} / {nutrient.goal}{nutrient.unit}
                    </span>
                  </div>
                  <div className="h-2 bg-green-100 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${(nutrient.current / nutrient.goal) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>



        <div className="mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Brain className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800">AI Coach Recommendations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Workout Plan */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">Today's Workout Plan</h3>
              </div>

              {aiRecommendations ? (
                <div className="space-y-4">
                  <p className="text-green-700 font-medium">{aiRecommendations.workoutPlan.title}</p>
                  <p className="text-green-600 text-sm">{aiRecommendations.workoutPlan.description}</p>
                  
                  <div className="space-y-3">
                    {aiRecommendations.workoutPlan.exercises.map((exercise, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-green-800">{exercise.name}</span>
                          <span className="text-green-600">
                            {exercise.duration || `${exercise.sets} × ${exercise.reps}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-green-600">Generating personalized workout plan...</p>
                </div>
              )}
            </div>

            {/* Diet Plan */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Utensils className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800">Today's Meal Plan</h3>
              </div>

              {aiRecommendations ? (
                <div className="space-y-4">
                  <p className="text-green-700 font-medium">{aiRecommendations.dietPlan.title}</p>
                  <p className="text-green-600 text-sm">{aiRecommendations.dietPlan.description}</p>

                  <div className="space-y-4">
                    {aiRecommendations.dietPlan.meals.map((meal, index) => (
                      <div key={index} className="bg-green-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-green-800">{meal.type}</span>
                          <span className="text-sm text-green-600">
                            {meal.nutrients.calories} cal
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {meal.suggestions.map((suggestion, idx) => (
                            <li key={idx} className="text-green-600 text-sm flex items-center">
                              <ChevronRight className="h-4 w-4 mr-1" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                        <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-green-600">
                          <div>Protein: {meal.nutrients.protein}g</div>
                          <div>Carbs: {meal.nutrients.carbs}g</div>
                          <div>Fats: {meal.nutrients.fats}g</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-green-600">Generating personalized meal plan...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}