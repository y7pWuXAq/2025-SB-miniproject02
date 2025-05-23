package com.xbooks.project.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Home {
    @GetMapping(path={"/", "/test/spring_test"})
    public String root(){
        return "구동 완료!";
    }
}
