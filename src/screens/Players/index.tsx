import { Container, Form } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";

export const Players = () => {
    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title="Nome da Turma"
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    placeholder="Nome da Pessoa"
                    autoCorrect={false}
                />
                
                <ButtonIcon icon="add" />
            </Form>
            <Filter title="Time A"/>
        </Container>
    );
}