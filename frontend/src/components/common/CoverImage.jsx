export default function CoverImage({ src, alt, className = '', objectFit = 'object-cover' }) {
  const fallbackImage =
    'https://images.unsplash.com/photo-1540039155733-d7696d54af58?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="w-full h-full relative bg-stone-200 flex justify-center items-center">
      <img
        src={src || fallbackImage}
        alt={alt || 'Event Cover'}
        className={`w-full h-full ${objectFit} ${className}`}
        loading="lazy"
      />
    </div>
  );
}
