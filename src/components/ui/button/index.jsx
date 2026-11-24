export default function Button({
    children,
    variant = 'outline',
    size = 'md',
    disabled = false,
    loading = false,
    fullWidth = false,
    block = false,
    mobileFull = false,
    icon = null,
    iconRight = null,
    iconOnly = false,
    pill = false,
    circle = false,
    type = 'button',
    ariaLabel,
    ariaDescribedBy,
    onClick,
    onMouseEnter,
    onMouseLeave,
    id,
    name,
    value,
    form,
    title,
    tabIndex,
    autoFocus,
    className = '',
    style,
    ...rest
}) {
    const classes = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full',
        block && 'btn-block',
        mobileFull && 'btn-mobile-full',
        iconOnly && 'btn-icon-only',
        pill && 'btn-pill',
        circle && 'btn-circle',
        loading && (iconOnly ? 'btn-loading-icon' : 'btn-loading'),
        disabled && 'disabled',
        className,
    ].filter(Boolean).join(' ');

    const isDisabled = disabled || loading;

    return (
        <button
            id={id}
            name={name}
            value={value}
            form={form}
            type={type}
            title={title}
            tabIndex={tabIndex}
            autoFocus={autoFocus}
            className={classes}
            style={style}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-disabled={isDisabled}
            aria-busy={loading}
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...rest}
        >
            {loading && <span className="btn-spinner" aria-hidden="true" />}
            <span className="btn-content">
                {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
                {children}
                {iconRight && <span className="btn-icon" aria-hidden="true">{iconRight}</span>}
            </span>
        </button>
    );
}
