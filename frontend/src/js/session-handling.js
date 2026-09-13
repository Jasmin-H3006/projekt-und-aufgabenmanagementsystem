export function requireLogin(
    setUsername, needsAdminAccess,
    needsAllProjectsAccess, needsCreateProjectsAccess,
    needsEditAvailableProjectsAccess, needsCreateAndEditTasksAccess,
    needsCustomerPageAccess
) {
    return fetch("http://localhost:8080/api/auth/current-user", { credentials: "include" })
        .then(res => {
            if (!res.ok) {
                window.location.href = "/";
                return null;
            }
            return res.json();
        })
        .then(user => {
            if (!user) return null;
            if (user.userStatus !== "ACTIVE") {
                window.location.href = "/";
                return null;
            }
            if (setUsername) setUsername(user.username);
            if(
                (needsAdminAccess && !user.adminAccess) ||
                (needsAllProjectsAccess && !user.allProjectsAccess) ||
                (needsCreateProjectsAccess && !user.createProjectsAccess) ||
                (needsEditAvailableProjectsAccess && !user.editAvailableProjectsAccess) ||
                (needsCreateAndEditTasksAccess && !user.createAndEditTasksAccess) ||
                (needsCustomerPageAccess && !user.customerPageAccess)
            ) {
                window.location.href = "../home/home.html";
                return null;
            }
            return user;
        });
}