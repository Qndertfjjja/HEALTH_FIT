import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function HealthTracking() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('activity');
  
  const [activity, setActivity] = useState({
    type: '',
    duration: '',
    calories: '',
    distance: '',
    notes: ''
  });

  const [nutrition, setNutrition] = useState({
    mealType: 'breakfast',
    foodItem: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    notes: ''
  });

  const [sleep, setSleep] = useState({
    startTime: '',
    endTime: '',
    quality: '5',
    notes: ''
  });

  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/activities', activity);
      setActivity({ type: '', duration: '', calories: '', distance: '', notes: '' });
      alert('Activity logged successfully!');
    } catch (error) {
      console.error('Error logging activity:', error);
      alert('Failed to log activity');
    }
  };

  const handleNutritionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/nutrition', nutrition);
      setNutrition({
        mealType: 'breakfast',
        foodItem: '',
        calories: '',
        protein: '',
        carbs: '',
        fats: '',
        notes: ''
      });
      alert('Nutrition logged successfully!');
    } catch (error) {
      console.error('Error logging nutrition:', error);
      alert('Failed to log nutrition');
    }
  };

  const handleSleepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/sleep', sleep);
      setSleep({ startTime: '', endTime: '', quality: '5', notes: '' });
      alert('Sleep logged successfully!');
    } catch (error) {
      console.error('Error logging sleep:', error);
      alert('Failed to log sleep');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Health Activity Tracking</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button
            className={\`pb-2 px-4 \${activeTab === 'activity' ? 'border-b-2 border-blue-500' : ''}\`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
          <button
            className={\`pb-2 px-4 \${activeTab === 'nutrition' ? 'border-b-2 border-blue-500' : ''}\`}
            onClick={() => setActiveTab('nutrition')}
          >
            Nutrition
          </button>
          <button
            className={\`pb-2 px-4 \${activeTab === 'sleep' ? 'border-b-2 border-blue-500' : ''}\`}
            onClick={() => setActiveTab('sleep')}
          >
            Sleep
          </button>
        </div>
      </div>

      {activeTab === 'activity' && (
        <form onSubmit={handleActivitySubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Activity Type</label>
            <input
              type="text"
              value={activity.type}
              onChange={(e) => setActivity({...activity, type: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="e.g., Running, Cycling"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={activity.duration}
              onChange={(e) => setActivity({...activity, duration: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Calories Burned</label>
            <input
              type="number"
              value={activity.calories}
              onChange={(e) => setActivity({...activity, calories: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Distance (km)</label>
            <input
              type="number"
              step="0.01"
              value={activity.distance}
              onChange={(e) => setActivity({...activity, distance: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              value={activity.notes}
              onChange={(e) => setActivity({...activity, notes: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Log Activity
          </button>
        </form>
      )}

      {activeTab === 'nutrition' && (
        <form onSubmit={handleNutritionSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Meal Type</label>
            <select
              value={nutrition.mealType}
              onChange={(e) => setNutrition({...nutrition, mealType: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Food Item</label>
            <input
              type="text"
              value={nutrition.foodItem}
              onChange={(e) => setNutrition({...nutrition, foodItem: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Calories</label>
            <input
              type="number"
              value={nutrition.calories}
              onChange={(e) => setNutrition({...nutrition, calories: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={nutrition.protein}
                onChange={(e) => setNutrition({...nutrition, protein: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Carbs (g)</label>
              <input
                type="number"
                step="0.1"
                value={nutrition.carbs}
                onChange={(e) => setNutrition({...nutrition, carbs: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-1">Fats (g)</label>
              <input
                type="number"
                step="0.1"
                value={nutrition.fats}
                onChange={(e) => setNutrition({...nutrition, fats: e.target.value})}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              value={nutrition.notes}
              onChange={(e) => setNutrition({...nutrition, notes: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Log Nutrition
          </button>
        </form>
      )}

      {activeTab === 'sleep' && (
        <form onSubmit={handleSleepSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Sleep Start Time</label>
            <input
              type="datetime-local"
              value={sleep.startTime}
              onChange={(e) => setSleep({...sleep, startTime: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Sleep End Time</label>
            <input
              type="datetime-local"
              value={sleep.endTime}
              onChange={(e) => setSleep({...sleep, endTime: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block mb-1">Sleep Quality (1-5)</label>
            <select
              value={sleep.quality}
              onChange={(e) => setSleep({...sleep, quality: e.target.value})}
              className="w-full p-2 border rounded"
              required
            >
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div>
            <label className="block mb-1">Notes</label>
            <textarea
              value={sleep.notes}
              onChange={(e) => setSleep({...sleep, notes: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Log Sleep
          </button>
        </form>
      )}
    </div>
  );
}
