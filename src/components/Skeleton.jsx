function Skeleton({ 
  variant = 'text',    // 'text', 'title', 'circle', 'rectangle'
  width = '100%',      // Width of skeleton
  height,              // Height (optional)
  className = ''       // Additional classes
}) {
  
  const variants = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg'
  };

  const baseClasses = 'bg-gray-200 animate-pulse';
  const variantClass = variants[variant];

  const style = {
    width,
    height: height || (variant === 'circle' ? width : undefined)
  };

  return (
    <div 
      className={`${baseClasses} ${variantClass} ${className}`}
      style={style}
    />
  );
}

export default Skeleton;