'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Moon, AlertCircle, CheckCircle2 } from 'lucide-react';

const sleepFormSchema = z.object({
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  quality: z.enum(['Poor', 'Fair', 'Good', 'Excellent'], {
    required_error: "Sleep quality is required",
  }),
  notes: z.string().optional(),
}).refine(data => new Date(data.endTime) > new Date(data.startTime), {
  message: "End time must be after start time",
  path: ["endTime"],
});

type SleepFormValues = z.infer<typeof sleepFormSchema>;

export default function SleepPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toISOString().slice(0, 16);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SleepFormValues>({
    resolver: zodResolver(sleepFormSchema),
    defaultValues: {
      startTime: getCurrentDateTime(),
      endTime: getCurrentDateTime(),
      quality: 'Good',
      notes: '',
    },
  });

  useEffect(() => {
    const pendingSleep = sessionStorage.getItem('pendingSleep');
    if (pendingSleep) {
      const data = JSON.parse(pendingSleep);
      reset(data);
      sessionStorage.removeItem('pendingSleep');
    }
  }, [reset]);

  async function onSubmit(data: SleepFormValues) {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/health-activity/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: new Date(data.startTime),
          endTime: new Date(data.endTime),
          quality: data.quality,
          notes: data.notes
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage('Please log in to track sleep');
          sessionStorage.setItem('pendingSleep', JSON.stringify(data));
          setTimeout(() => {
            router.push('/login?redirect=/health-activity/sleep');
          }, 2000);
          return;
        }
        throw new Error('Failed to submit sleep record');
      }

      setShowSuccess(true);
      reset({
        startTime: getCurrentDateTime(),
        endTime: getCurrentDateTime(),
        quality: 'Good',
        notes: ''
      });
    } catch (error: any) {
      console.error('Error submitting sleep record:', error);
      setErrorMessage(error.message || 'Failed to submit sleep record');
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
              <Moon className="h-6 w-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-green-800">Track Sleep</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Sleep Start Time
                </label>
                <input
                  type="datetime-local"
                  {...register('startTime')}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                {errors.startTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.startTime.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-green-700 mb-1">
                  Sleep End Time
                </label>
                <input
                  type="datetime-local"
                  {...register('endTime')}
                  className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
                {errors.endTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.endTime.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">
                Sleep Quality
              </label>
              <select
                {...register('quality')}
                className="w-full px-4 py-2 rounded-lg border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              >
                <option value="Poor">Poor</option>
                <option value="Fair">Fair</option>
                <option value="Good">Good</option>
                <option value="Excellent">Excellent</option>
              </select>
              {errors.quality && (
                <p className="mt-1 text-sm text-red-500">{errors.quality.message}</p>
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
              {isSubmitting ? 'Submitting...' : 'Submit Sleep Record'}
            </button>
          </form>
        </div>

        {/* Notifications */}
        {showSuccess && (
          <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <CheckCircle2 className="h-5 w-5" />
            <p>Sleep record saved successfully!</p>
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