import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftIcon?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  hint,
  error,
  leftIcon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || rest.name || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <label className="block w-full space-y-1.5">
      {label && (
        <span className="block text-sm font-medium text-ink">{label}</span>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted text-[20px]">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full h-11 min-h-touch rounded-lg border bg-white px-3.5 text-sm text-ink placeholder:text-ink-muted transition-all duration-200 focus:border-brand focus:shadow-focus focus:outline-none ${
            leftIcon ? 'pl-10' : ''
          } ${error ? 'border-danger' : 'border-border'} ${className}`}
          {...rest}
        />
      </div>
      {error ? (
        <span className="block text-xs text-danger">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-ink-muted">{hint}</span>
      ) : null}
    </label>
  );
};

export const TextArea: React.FC<
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
> = ({ label, className = '', ...rest }) => (
  <label className="block w-full space-y-1.5">
    {label && <span className="block text-sm font-medium text-ink">{label}</span>}
    <textarea
      className={`w-full min-h-[100px] rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-brand ${className}`}
      {...rest}
    />
  </label>
);
