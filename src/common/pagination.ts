export function paginate(page = 1, pageSize = 10) {
    const take = Math.max(1, Math.min(100, pageSize));
    const skip = Math.max(0, (Math.max(1, page) - 1) * take);
    return { skip, take };
}