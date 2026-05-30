export function requireLogin(setUsername) {
    return fetch("http://localhost:8080/api/auth/current-user", { credentials: "include" })
        .then(res => {
            if (!res.ok) {
                window.location.href = "/";
                return null;
            }
            return res.text();
        })
        .then(name => {
            if (name && setUsername) setUsername(name);
        });
}