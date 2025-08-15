package br.com.alura.screenmatch.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

@Service
public class ConsumoApi {

    @Value("${omdb.apikey}")
    private String apiKey;

    private final String ENDERECO_BASE = "https://www.omdbapi.com/?t=";

    public String obterDados(String tituloSerie) {
        // Codifica o título da série para ser seguro para URL
        String tituloCodificado = URLEncoder.encode(tituloSerie, StandardCharsets.UTF_8);
        String endereco = ENDERECO_BASE + tituloCodificado + "&apikey=" + apiKey;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(endereco))
                .build();
        HttpResponse<String> response;
        try {
            response = client
                    .send(request, HttpResponse.BodyHandlers.ofString());
        } catch (IOException | InterruptedException e) {
            throw new RuntimeException("Falha ao consultar a API externa: " + e.getMessage(), e);
        }

        String json = response.body();
        if (json.contains("\"Response\":\"False\"")) {
            throw new RuntimeException("Série não encontrada na API do OMDB: " + tituloSerie);
        }
        return json;
    }
}
