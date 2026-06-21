import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Camera } from 'lucide-react';
import { userApi } from '../../api/user.api.js';
import { loginSuccess } from '../../store/authSlice.js';

export default function ProfileHeader() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profilePhoto', file);

    try {
      setIsUploading(true);
      setError(null);
      const res = await userApi.addProfilePhoto(formData);
      dispatch(loginSuccess(res.data.data));
    } catch (err) {
      setError('Failed to update profile photo.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 flex items-center gap-8">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-stone-200 border-4 border-white shadow-md">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-serif text-stone-400 bg-stone-100">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>

        <label className="absolute bottom-0 right-0 p-2 bg-stone-900 text-white rounded-full cursor-pointer hover:bg-orange-800 transition-colors shadow-md group-hover:scale-110">
          <Camera size={14} />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUploading}
          />
        </label>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mb-1">
          {user?.fullName || 'Aura Member'}
        </h1>
        <p className="text-stone-500 font-medium">{user?.email}</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {isUploading && (
          <p className="text-orange-800 text-sm mt-2 font-medium animate-pulse">
            Uploading photo...
          </p>
        )}
      </div>
    </div>
  );
}
