import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({ label, error, className = '', type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordInput = type === 'password';
  const inputType = isPasswordInput ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col w-full mb-4">
      <label className="text-sm font-bold text-stone-700 mb-1.5">{label}</label>
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`w-full px-4 py-3 bg-stone-100/50 border border-stone-200 rounded-xl outline-none focus:bg-white focus:border-stone-400 focus:ring-4 focus:ring-stone-100 transition-all font-medium text-stone-800 placeholder:text-stone-400 ${className} ${
            error ? 'border-red-300 focus:border-red-400 focus:ring-red-50' : ''
          }`}
          {...props}
        />
        {isPasswordInput && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-1.5 font-medium">{error.message}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
