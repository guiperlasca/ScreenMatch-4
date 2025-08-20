package br.com.alura.screenmatch.repository;

import br.com.alura.screenmatch.model.ListaPersonalizada;
import br.com.alura.screenmatch.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ListaPersonalizadaRepository extends JpaRepository<ListaPersonalizada, Long> {
    List<ListaPersonalizada> findByUsuario(Usuario usuario);
    List<ListaPersonalizada> findByPublica(boolean publica);
}
