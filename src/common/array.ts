export function createUniqueSet<TKey extends number | string, TValue>(
    values: TValue[],
    getKey: (value: TValue) => TKey
): Record<TKey, TValue> {
    return values.reduce((set, value) => {
        set[getKey(value)] = value;
        return set;
    }, {} as Record<TKey, TValue>);
}