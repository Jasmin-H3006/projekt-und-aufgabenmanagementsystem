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

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class AuthController {

     private final AuthService authService;
     private final LoginService loginService;

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

    @GetMapping("/current-user")
    public ResponseEntity<String> currentUser(HttpSession session) {
        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok(username);
    }

    @GetMapping("/admin-exists")
    public ResponseEntity<Boolean> adminExists() {
        return ResponseEntity.ok(authService.adminExists());
    }
}