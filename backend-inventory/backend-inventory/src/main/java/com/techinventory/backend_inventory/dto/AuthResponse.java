package com.techinventory.backend_inventory.dto;

public class AuthResponse {

    private String accessToken;
    private UsuarioDTO usuario;

    public AuthResponse(String accessToken, UsuarioDTO usuario) {
        this.accessToken = accessToken;
        this.usuario = usuario;
    }

    public String getAccessToken() { return accessToken; }
    public UsuarioDTO getUsuario() { return usuario; }
}