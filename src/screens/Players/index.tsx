import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

import { useRoute } from "@react-navigation/native";
import { Alert, FlatList } from "react-native";
import { useState, useEffect } from "react";

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
import { playersGetByGroup } from "src/storage/player/playersGetByGroup";
import { playersGetByGroupAndTeam } from "src/storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "src/storage/player/PlayerStorageDTO";

type RouteParams = {
    group: string;
}

export const Players = () => {
    const [team, setTeam] = useState('Time A');
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])
    const [newPlayerName, setNewPlayerName] = useState('')

    const route = useRoute()
    const { group } = route.params as RouteParams;

    const handleAddPlayer = async () => {
        if(newPlayerName.trim().length === 0){
            return Alert.alert('Nova pessoa', 'Insira o nome da pessoa para adicionar.')
        };

        const newPlayer = {
            name: newPlayerName,
            team,
        };

        try {
            await PlayerAddByGroup(newPlayer, group);
            
        } catch (error) {
            if(error instanceof AppError){
                Alert.alert('Nova pessoa', error.message)
            } else {
                console.log(error);
                Alert.alert('Nova pessoa', 'Não foi possível adicionar.')
            };
        };
    };

    const fetchPlayersByTeam = async () => {
        try {
            const playersByTeam = await playersGetByGroupAndTeam(group, team)
            setPlayers(playersByTeam)
        } catch (error) {
            console.log(error);
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas do time selecionado.')
        }
    }
    
    useEffect(() => {
        fetchPlayersByTeam();
    }, [team, players])

    return (
        <Container>
            <Header showBackButton />

            <Highlight
                title={group}
                subtitle="Adicione a galera e separe os times"
            />

            <Form>
                <Input
                    placeholder="Nome da Pessoa"
                    autoCorrect={false}
                    onChangeText={setNewPlayerName}
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

            <FlatList
                data={players}
                keyExtractor={item => item.name}
                renderItem={({ item }) => (
                    <PlayerCard
                        name={item.name}
                        onRemove={() => { }}
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

            <Button
                title="Remover Turma"
                type="SECONDARY"
            />

        </Container>
    );
}