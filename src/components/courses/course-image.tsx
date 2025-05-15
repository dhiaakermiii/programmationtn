"use client";

interface CourseImageProps {
  imageUrl?: string | null;
  title: string;
}

export function CourseImage({ imageUrl, title }: CourseImageProps) {
  return (
    <div className="relative aspect-video w-full bg-muted">
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={`${title} cover image`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, replace with a placeholder
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite error loop
            target.src = "https://placehold.co/1200x675/e2e8f0/64748b?text=Course+Image+Unavailable";
          }}
        />
      ) : (
        // Placeholder for when no image URL is provided
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
          <div className="text-center text-slate-500 p-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto mb-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No image</p>
          </div>
        </div>
      )}
    </div>
  );
} 