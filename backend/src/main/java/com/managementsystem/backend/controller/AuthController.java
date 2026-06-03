package com.managementsystem.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import com.managementsystem.backend.service.AuthService;
import com.managementsystem.backend.service.LoginService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import java.util.List;
import com.managementsystem.backend.dto.Dtos.CurrentUserDTO;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.repository.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

     private final AuthService authService;
     private final LoginService loginService;
     private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody NewUserDTO dto) {
        return authService.registerAdmin(dto);
    }

    @PostMapping("/log-in")
    public ResponseEntity<String> loginUser(@RequestBody NewUserDTO dto, HttpServletRequest request) {
        ResponseEntity<String> result = loginService.loginUser(dto);
        if (result.getStatusCode().is2xxSuccessful()) {
            HttpSession session = request.getSession(true);

            // Store the username in the session
            session.setAttribute("username", dto.username());

            UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(dto.username(), null, List.of());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        return result;
    }

    // Beispiel: /api/auth/logout
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok().build();
    }

    @GetMapping("/current-user")
    public ResponseEntity<CurrentUserDTO> currentUser(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByUsername(username);
        Role role = user.getRole();

        CurrentUserDTO dto = new CurrentUserDTO(
            user.getUsername(),
            role.getAdminAccess(),
            role.getAllProjectsAccess(),
            role.getCreateProjectsAccess(),
            role.getEditAvailableProjectsAccess(),
            role.getCreateAndEditTasksAccess(),
            role.getCustomerPageAccess()
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/admin-exists")
    public ResponseEntity<Boolean> adminExists() {
        return ResponseEntity.ok(authService.adminExists());
    }
}