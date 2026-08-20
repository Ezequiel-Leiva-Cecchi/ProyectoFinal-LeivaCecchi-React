import { AlertTriangle, SearchX } from 'lucide-react';

export default function StatePanel({
  title,
  message,
  actionLabel,
  onAction,
  variant = 'empty',
}) {
  const Icon = variant === 'error' ? AlertTriangle : SearchX;

  return (
    <section className={`state-panel state-panel--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      <span className="state-panel__icon" aria-hidden="true">
        <Icon size={28} />
      </span>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction && (
        <button className="button button--secondary" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}
