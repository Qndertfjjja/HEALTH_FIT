'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Heart, X } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  profile: {
    age: number | null;
    height: string | null;
    weight: string | null;
    goals: string | null;
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    profile: {
      age: null,
      height: null,
      weight: null,
      goals: null,
    },
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('API Error:', data);
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfileData(data);
      setFormData(data);
    } catch (error) {
      console.error('Client-side error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        age: formData.profile?.age ? Number(formData.profile.age) : null,
        height: formData.profile?.height || null,
        weight: formData.profile?.weight || null,
        goals: formData.profile?.goals || null,
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedProfile),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfileData(data);
      setFormData(data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert(error.message || 'Failed to update profile. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-8 relative">
        {/* Close button */}
        <button
          onClick={() => router.push('/')}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-green-50 transition-colors group"
          aria-label="Close profile"
        >
          <X className="h-6 w-6 text-gray-400 group-hover:text-green-500 transition-colors" />
        </button>

        <div className="flex items-center space-x-6 mb-8">
          <div className="relative w-24 h-24 rounded-full ring-4 ring-green-100">
            <Image
              src="/default-avatar.png"
              alt="Profile"
              width={96}
              height={96}
              className="rounded-full object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Heart className="h-5 w-5 text-green-500" />
              <h1 className="text-2xl font-bold text-gray-900">{profileData.name}</h1>
            </div>
            <p className="text-gray-600">{profileData.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.profile?.age || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                <input
                  type="text"
                  name="height"
                  value={formData.profile?.height || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 5'10''"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                <input
                  type="text"
                  name="weight"
                  value={formData.profile?.weight || ''}
                  onChange={handleInputChange}
                  placeholder="e.g., 70kg"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goals</label>
              <textarea
                name="goals"
                value={formData.profile?.goals || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="What are your fitness goals?"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-lg hover:bg-green-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-600 mb-1">Age</h3>
                <p className="text-gray-900">
                  {profileData.profile?.age ? `${profileData.profile.age} years` : 'Not set'}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-600 mb-1">Height</h3>
                <p className="text-gray-900">
                  {profileData.profile?.height || 'Not set'}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-600 mb-1">Weight</h3>
                <p className="text-gray-900">
                  {profileData.profile?.weight || 'Not set'}
                </p>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-600 mb-2">Fitness Goals</h3>
              <p className="text-gray-900 whitespace-pre-wrap">
                {profileData.profile?.goals || 'Not set'}
              </p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-6 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}