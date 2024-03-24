import { Header } from "@components/Header";
import { Container } from "./styles";
import { Highlight } from "@components/Highlight";

export const Players = () => {
    return (
        <Container>
            <Header showBackButton/>            

            <Highlight title="Nome da Turma" subtitle="Adicione a galera e separe os times"/>
        </Container>
    );
}