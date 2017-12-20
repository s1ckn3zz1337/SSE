export function isAuthenticated(data: string) {
    return new Promise((resolve, reject) => {
        Math.random() > 0 ? resolve(data) : reject(data);
    });
};

export function isAdmin(data: string) {
    return new Promise((resolve, reject) => {
        Math.random() > 0 ? resolve(data) : reject(data);
    });
};