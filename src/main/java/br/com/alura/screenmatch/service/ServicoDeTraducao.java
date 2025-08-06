package br.com.alura.screenmatch.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class ServicoDeTraducao {
    public static String obterTraducao(String texto) {
        String textoCodificado = URLEncoder.encode(texto, StandardCharsets.UTF_8);

        // Define o par de idiomas
        String langpair = "en|pt";

        // Monta a URL e substitui o caractere ilegal '|' por sua codificação '%7C'
        String url = "https://api.mymemory.translated.net/get?q=" + textoCodificado + "&langpair=" + langpair.replace("|", "%7C");

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .build();

        try {
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Se a requisição falhar, retorna o texto original
            if (response.statusCode() != 200) {
                return texto;
            }

            ObjectMapper mapper = new ObjectMapper();
            JsonNode jsonNode = mapper.readTree(response.body());

            // Extrai a tradução da resposta
            return jsonNode.get("responseData").get("translatedText").asText();

        } catch (IOException | InterruptedException e) {
            // Se ocorrer qualquer erro, retorna o texto original para não quebrar a aplicação
            return texto;
        }
    }
}