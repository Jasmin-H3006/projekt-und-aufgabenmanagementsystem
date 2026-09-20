package com.managementsystem.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.model.TaskState;
import com.managementsystem.backend.service.RoleService;
import com.managementsystem.backend.service.TaskStateService;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleService roleService;
    private final TaskStateService taskStateService;

    @Override
    public void run(String... args) throws Exception {
        // Check if roles exist, if not create them
        if (!roleService.roleExists("Administrator")) {
            roleService.createRole(Role.builder()
                .name("Administrator")
                .adminAccess(true)
                .allProjectsAccess(true)
                .createProjectsAccess(true)
                .editAvailableProjectsAccess(true)
                .createAndEditTasksAccess(true)
                .customerPageAccess(true)
                .build());
        }
        if (!roleService.roleExists("Projektleiter")) {
            roleService.createRole(Role.builder()
                .name("Projektleiter")
                .adminAccess(false)
                .allProjectsAccess(false)
                .createProjectsAccess(true)
                .editAvailableProjectsAccess(true)
                .createAndEditTasksAccess(true)
                .customerPageAccess(true)
                .build());
        }
        if (!roleService.roleExists("Mitarbeiter")) {
            roleService.createRole(Role.builder()
                .name("Mitarbeiter")
                .adminAccess(false)
                .allProjectsAccess(false)
                .createProjectsAccess(false)
                .editAvailableProjectsAccess(false)
                .createAndEditTasksAccess(true)
                .customerPageAccess(false)
                .build());
        }

        // Check if task states exist, if not create them
        if (!taskStateService.taskStateExists("Offen")) {
            taskStateService.createTaskState(TaskState.builder()
                .name("Offen")
                .color("#d74e4e") // Red
                .fontColorBlack(false) // White
                .taskDoneState(false)
                .build());
        }
        if (!taskStateService.taskStateExists("In Bearbeitung")) {
            taskStateService.createTaskState(TaskState.builder()
                .name("In Bearbeitung")
                .color("#ebb427") // Yellow
                .fontColorBlack(true) // Black
                .taskDoneState(false)
                .build());
        }
        if (!taskStateService.taskStateExists("Erledigt")) {
            taskStateService.createTaskState(TaskState.builder()
                .name("Erledigt")
                .color("#50a820") // Green
                .fontColorBlack(false) // White
                .taskDoneState(true)
                .build());
        }
    }
}