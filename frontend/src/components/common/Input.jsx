import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col w-full mb-4">
      {label && <label className="mb-1.5 text-sm font-semibold text-stone-700">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-3 bg-white border ${
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-stone-200 focus:border-orange-500 focus:ring-orange-100'
        } rounded-xl shadow-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-4 transition-all duration-200 ${className}`}
        {...props}
      />
      {error && <span className="mt-1.5 text-xs font-medium text-red-500">{error.message}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
