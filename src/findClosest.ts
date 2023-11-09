export function findClosest(list: number[], target: number) {
    return list.reduce((prev, curr) =>
        Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    );
}
