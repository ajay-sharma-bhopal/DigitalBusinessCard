export function Avatar({ name, src, size = 'lg' }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const sizeClasses = {
    sm: 'w-12 h-12 text-lg',
    md: 'w-16 h-16 text-xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl',
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover ring-2 ring-white/30 ring-offset-2 ring-offset-transparent`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white/30 ring-offset-2 ring-offset-transparent`}
      style={{
        background: 'linear-gradient(135deg, #3b5bdb 0%, #7c3aed 100%)',
      }}
    >
      {initials}
    </div>
  )
}
