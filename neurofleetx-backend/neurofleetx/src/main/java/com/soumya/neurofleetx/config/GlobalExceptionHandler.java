package com.soumya.neurofleetx.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAllExceptions(Exception ex, WebRequest request) {
        return new ResponseEntity<>(
            new ApiError("Internal Server Error", ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value()),
            HttpStatus.INTERNAL_SERVER_ERROR
        );
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Object> handleRuntimeException(RuntimeException ex, WebRequest request) {
        return new ResponseEntity<>(
            new ApiError("Bad Request", ex.getMessage(), HttpStatus.BAD_REQUEST.value()),
            HttpStatus.BAD_REQUEST
        );
    }

    static class ApiError {
        private String message;
        private String details;
        private int code;

        public ApiError(String message, String details, int code) {
            this.message = message;
            this.details = details;
            this.code = code;
        }

        // getters/setters
        public String getMessage() { return message; }
        public String getDetails() { return details; }
        public int getCode() { return code; }
    }
}