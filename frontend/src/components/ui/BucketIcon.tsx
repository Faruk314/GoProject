interface Props {
  className?: string;
  style?: React.CSSProperties;
}

export function BucketIcon({ className, style }: Props) {
  return (
    <svg
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11l-8 8-4-4 8-8 4 4zM7 7V5a2 2 0 012-2h1a2 2 0 012 2v2m-5 0h5"
      />
    </svg>
  );
}
