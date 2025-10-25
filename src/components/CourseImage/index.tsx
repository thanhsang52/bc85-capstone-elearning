import { useState, useEffect } from 'react';

interface CourseImageProps {
  src: string;
  alt: string;
  className?: string;
}

const CourseImage = ({ src, alt, className }: CourseImageProps) => {
  const defaultImage = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center';
  const [imgSrc, setImgSrc] = useState(() => {
    // Kiểm tra URL hợp lệ
    if (!src || src.trim() === '' || !src.startsWith('http')) {
      return defaultImage;
    }
    return src;
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!src || src.trim() === '' || !src.startsWith('http')) {
      setImgSrc(defaultImage);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(defaultImage);
      setHasError(true);
    }
  };

  return (
    <div className="w-full h-full max-h-[300px] overflow-hidden">
      <img
        src={imgSrc}
        alt={alt}
        className="w-full h-full max-h-[300px] object-cover"
        onError={handleError}
      />
    </div>
  );
};

export default CourseImage;