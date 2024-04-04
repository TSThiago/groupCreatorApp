import { Button } from "@components/Button";
import { Container, Content, Icon } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "src/storage/group/groupCreate";

export const NewGroup = () => {
    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    const handleNew = async () => {
        try {
            await groupCreate(group);
            navigation.navigate('players', { group: group });
        } catch (error) {
            console.log(error);
        };
    };

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />

                <Highlight
                    title="Nova Turma"
                    subtitle="Crie a turma para adicionar as pessoas"
                />

                <Input
                    placeholder="Nome da turma"
                    onChangeText={setGroup}
                />

                <Button
                    title="Criar"
                    style={{ marginTop: 20 }}
                    onPress={handleNew}
                />

            </Content>
        </Container>
    )
}