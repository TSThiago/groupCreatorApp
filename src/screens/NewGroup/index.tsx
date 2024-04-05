import { Button } from "@components/Button";
import { Container, Content, Icon } from "./styles";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { groupCreate } from "src/storage/group/groupCreate";
import { AppError } from "@utils/AppError";
import { Alert } from "react-native";

export const NewGroup = () => {
    const [group, setGroup] = useState('');

    const navigation = useNavigation();

    const handleNew = async () => {
        try {
            if(group.trim().length === 0) {
                return Alert.alert('Novo grupo', 'Informe o nome da turma.');
            }

            await groupCreate(group);
            navigation.navigate('players', { group: group });
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Novo grupo', error.message);
            } else {
                Alert.alert('Novo grupo', 'Não foi possível criar o grupo.');
                console.log(error);
            };
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