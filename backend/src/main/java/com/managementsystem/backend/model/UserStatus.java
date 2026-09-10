package com.managementsystem.backend.model;

public enum UserStatus {
    INVITED, // User has been invited but has not yet accepted the invitation
    ACTIVE, // User is active (has set his own password) and can log in
    DISABLED // User is disabled (Invitation-Token is expired) and cannot log in
}