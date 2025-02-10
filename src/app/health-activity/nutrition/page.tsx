'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Utensils, AlertCircle, CheckCircle2 } from 'lucide-react';

const nutritionFormSchema = z.object({
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack'], {
    required_error: 'Meal type is required',
  }),
  foodName: z.string().min(2, 'Food name must be at least 2 characters'),
  calories: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Calories must be a valid number',
  }),
  protein: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Protein must be a valid number',
  }),
  carbs: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Carbs must be a valid number',
  }),
  fats: z.string().refine((val) => !isNaN(Number(val)), {
    message: 'Fats must be a valid number',
  }),
  servingSize: z.string().min(1, 'Serving size is required'),
  notes: z.string().optional(),
});

type NutritionFormValues = z.infer<typeof nutritionFormSchema>;

export default function NutritionPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NutritionFormValues>({
    resolver: zodResolver(nutritionFormSchema),
    defaultValues: {
      mealType: 'Breakfast',
      foodName: '',
      calories: '',
      protein: '',
      carbs: '',
      fats: '',
      servingSize: '',
      notes: '',
    },
  });

  async function onSubmit(data: NutritionFormValues) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/health-activity/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mealType: data.mealType,
          foodItems: [
            {
              name: data.foodName,
              calories: Number(data.calories),
              protein: Number(data.protein),
              carbs: Number(data.carbs),
              fats: Number(data.fats),
              servingSize: data.servingSize,
            },
          ],
          totalCalories: Number(data.calories),
          notes: data.notes,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to submit nutrition data');
      }

      setShowSuccess(true);
      reset();
    } catch (error: any) {
      console.error('Error submitting nutrition data:', error);
      setErrorMessage(error.message || 'Failed to submit nutrition data');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Utensils className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">Track Nutrition</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Meal Type
                </label>
                <select
                  {...register('mealType')}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                >
                  {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.mealType && (
                  <p className="mt-1 text-sm text-red-500">{errors.mealType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Food Name
                </label>
                <input
                  {...register('foodName')}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                {errors.foodName && (
                  <p className="mt-1 text-sm text-red-500">{errors.foodName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['calories', 'protein', 'carbs', 'fats'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-green-700 mb-1 capitalize">
                    {field}
                  </label>
                  <input
                    type="number"
                    {...register(field as keyof NutritionFormValues)}
                    className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  />
                  {errors[field as keyof NutritionFormValues] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[field as keyof NutritionFormValues]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Serving Size
              </label>
              <input
                {...register('servingSize')}
                placeholder="e.g., 100g, 1 cup"
                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              {errors.servingSize && (
                <p className="mt-1 text-sm text-red-500">{errors.servingSize.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isSubmitting
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Nutrition Data'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            <p>Nutrition data saved successfully!</p>
          </div>
        )}

        {showError && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}