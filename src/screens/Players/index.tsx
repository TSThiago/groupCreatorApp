import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { useNavigation, useRoute } from "@react-navigation/native";
import { Alert, FlatList, TextInput } from "react-native";
import { useState, useEffect, useRef } from "react";

import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { ButtonIcon } from "@components/ButtonIcon";
import { Input } from "@components/Input";
import { Filter } from "@components/Filter";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from "@components/ListEmpty";
import { Button } from "@components/Button";
import { AppError } from "@utils/AppError";

import { PlayerAddByGroup } from "src/storage/player/playerAddByGroup";
import { playersGetByGroupAndTeam } from "src/storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "src/storage/player/PlayerStorageDTO";
import { playerRemoveByGroup } from "src/storage/player/playerRemoveByGroup";
import { groupRemoveByName } from "src/storage/group/groupRemoveByName";
import { Loading } from "@components/Loading";

type RouteParams = {
    group: string;
}

export const Players = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [newPlayerName, setNewPlayerName] = useState('')

    const navigation = useNavigation();

    const route = useRoute()
    const { group } = route.params as RouteParams;

    const newPlayerInputRef = useRef<TextInput>(null);

    const handleAddPlayer = async () => {
        if (newPlayerName.trim().length === 0) {
            return Alert.alert('Nova pessoa', 'Insira o nome da pessoa para adicionar.')
        };

        const newPlayer = {
            name: newPlayerName,
            team,
        };

        try {
            await PlayerAddByGroup(newPlayer, group);

            newPlayerInputRef.current?.blur();

            setNewPlayerName('');
            fetchPlayersByTeam();

        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar.')
            };
        };
    };

    const fetchPlayersByTeam = async () => {
        try {
            setIsLoading(true)
            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemovePlayer = async (playerName: string) => {
        try {
            await playerRemoveByGroup(playerName, group);
            fetchPlayersByTeam();
        } catch (error) {
            console.log(error);
            Alert.alert('Remover pessoa', 'Não foi possível remover essa pessoa.');
        };
    };

    const groupRemove = async () => {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups')
        } catch (error) {
            console.log(error);
            Alert.alert('Remover grupo', 'Não foi possível remover a turma.');
        }
    };

    const handleRemoveGroup = async () => {
        Alert.alert(
            'Remover',
            'Deseja remover esta turma?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() }
            ]
        );
    };

    useEffect(() => {
        fetchPlayersByTeam();
    }, [team])

    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    inputRef={newPlayerInputRef}
                    onChangeText={setNewPlayerName}
                    placeholder="Nome da Pessoa"
                    value={newPlayerName}
                    autoCorrect={false}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType="done"
                />

                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>

            <HeaderList>
                <FlatList
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={item === team}
                            onPress={() => setTeam(item)}
                        />
                    )}
                    horizontal
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>

            {
                isLoading ? <Loading /> :

                    <FlatList
                        data={players}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard
                                name={item.name}
                                onRemove={() => handleRemovePlayer(item.name)}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmpty
                                message="Não há jogadores neste time"
                            />
                        )}

                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
                    />
            }


            <Button
                title="Remover turma"
                type="SECONDARY"
                onPress={handleRemoveGroup}
            />

        </Container>
    );
};

