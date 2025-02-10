'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Activity, AlertCircle, CheckCircle2 } from 'lucide-react';

const activityFormSchema = z.object({
  activityType: z.string().min(1, 'Activity type is required'),
  duration: z.number().min(1, 'Duration must be greater than 0'),
  intensity: z.enum(['Low', 'Medium', 'High']),
  caloriesBurned: z.number().min(1, 'Calories burned must be greater than 0'),
  notes: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activityFormSchema>;

export default function ActivityForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      activityType: '',
      duration: 0,
      intensity: 'Medium',
      caloriesBurned: 0,
      notes: '',
    },
  });

  useEffect(() => {
    const pendingActivity = sessionStorage.getItem('pendingActivity');
    if (pendingActivity) {
      const data = JSON.parse(pendingActivity);
      reset(data);
      sessionStorage.removeItem('pendingActivity');
    }
  }, [reset]);

  const onSubmit = async (data: ActivityFormValues) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/health-activity/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage('Please log in to track activities');
          sessionStorage.setItem('pendingActivity', JSON.stringify(data));
          setTimeout(() => {
            router.push('/login?redirect=/health-activity/activities');
          }, 2000);
          return;
        }
        throw new Error('Failed to submit activity');
      }

      setShowSuccess(true);
      reset();
    } catch (error: any) {
      console.error('Error submitting activity:', error);
      setErrorMessage(error.message || 'Failed to submit activity');
      setShowError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">Track Activity</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Activity Type
              </label>
              <input
                {...register('activityType')}
                placeholder="e.g., Running, Swimming"
                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              {errors.activityType && (
                <p className="mt-1 text-sm text-red-500">{errors.activityType.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  {...register('duration', { valueAsNumber: true })}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                {errors.duration && (
                  <p className="mt-1 text-sm text-red-500">{errors.duration.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Intensity
                </label>
                <select
                  {...register('intensity')}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                {errors.intensity && (
                  <p className="mt-1 text-sm text-red-500">{errors.intensity.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Calories Burned
              </label>
              <input
                type="number"
                {...register('caloriesBurned', { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              />
              {errors.caloriesBurned && (
                <p className="mt-1 text-sm text-red-500">{errors.caloriesBurned.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
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
              {isSubmitting ? 'Submitting...' : 'Submit Activity'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            <p>Activity recorded successfully!</p>
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