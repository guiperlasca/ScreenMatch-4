package br.com.alura.screenmatch.service;

import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.service.OpenAiService;

import java.util.List;

public class ConsultaChatGPT {
    public static String obterTraducao(String texto) {
        OpenAiService service = new OpenAiService("api-key");

        ChatMessage mensagemUsuario = new ChatMessage("user", "Traduza para o português o texto: " + texto);

        ChatCompletionRequest requisicao = ChatCompletionRequest.builder()
                .model("gpt-3.5-turbo")
                .messages(List.of(mensagemUsuario))
                .maxTokens(1000)
                .temperature(0.7)
                .build();

        var resposta = service.createChatCompletion(requisicao);
        return resposta.getChoices().get(0).getMessage().getContent();
    }
}