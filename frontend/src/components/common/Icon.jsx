export default function Icon({ name, className = "", size = 20 }) {
  return (
    <span
      className={`material-icons-outlined icon ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
