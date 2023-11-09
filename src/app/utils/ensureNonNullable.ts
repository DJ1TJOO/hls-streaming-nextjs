type RequiredNotNull<T> = Required<{
    [P in keyof T]: NonNullable<T[P]>;
}>;
type Ensure<T, K extends keyof T> = Omit<T, K> & RequiredNotNull<Pick<T, K>>;
type EnsureNonNullable<T, K extends keyof NonNullable<T>> = Ensure<
    NonNullable<T>,
    K
>;
