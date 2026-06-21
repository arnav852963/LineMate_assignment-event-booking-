import ProfileHeader from '../components/profile/ProfileHeader.jsx';

export default function Profile() {
  return (
    <div className="min-h-screen pt-32 px-4 md:px-6 pb-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-stone-900">Your Profile</h1>
          <p className="text-stone-500 mt-2">Manage your account and preferences.</p>
        </div>

        <ProfileHeader />

        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 h-64 flex items-center justify-center">
          <p className="text-stone-400 font-medium">More profile settings coming soon.</p>
        </div>
      </div>
    </div>
  );
}
