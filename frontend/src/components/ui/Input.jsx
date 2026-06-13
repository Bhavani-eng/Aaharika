const fieldClass = (error, className = '') =>
  `input-base ${error ? 'input-error' : ''} ${className}`;

export const Input = ({ label, error, hint, required, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-label block">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <input id={inputId} className={fieldClass(error)} {...props} />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-text-light">{hint}</p>}
    </div>
  );
};

export const Textarea = ({ label, error, hint, required, className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-label block">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea id={inputId} className={`${fieldClass(error)} min-h-[100px]`} {...props} />
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-text-light">{hint}</p>}
    </div>
  );
};

export const Select = ({ label, error, hint, required, options = [], className = '', id, ...props }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-label block">
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <select id={inputId} className={fieldClass(error)} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {hint && !error && <p className="text-xs text-text-light">{hint}</p>}
    </div>
  );
};

export const FileInput = ({ label, hint, onChange, accept = 'image/*', preview, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {label && <span className="text-label block">{label}</span>}
    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-background hover:bg-primary/5 hover:border-primary/40 transition-all duration-200">
      <div className="flex flex-col items-center justify-center py-4 px-4 text-center">
        <svg className="w-8 h-8 mb-2 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-text-light"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
      </div>
      <input type="file" accept={accept} onChange={onChange} className="hidden" />
    </label>
    {preview && (
      <img src={preview} alt="Preview" className="h-32 w-full rounded-xl object-cover border border-border-light" />
    )}
    {hint && <p className="text-xs text-text-light">{hint}</p>}
  </div>
);

export const SearchInput = ({ value, onChange, placeholder = 'Search...', onSubmit, className = '' }) => (
  <div className={`relative ${className}`}>
    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={(e) => e.key === 'Enter' && onSubmit?.()}
      placeholder={placeholder}
      className="input-base pl-10"
    />
  </div>
);
