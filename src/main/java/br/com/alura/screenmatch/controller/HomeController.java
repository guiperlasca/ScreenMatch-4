package br.com.alura.screenmatch.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HomeController {

    @GetMapping("/")
    @ResponseBody
    public String home() {
        return "CineVault API está funcionando! Acesse o frontend em http://localhost:5500";
    }
    
    @GetMapping("/health")
    @ResponseBody
    public String health() {
        return "OK";
    }
}
