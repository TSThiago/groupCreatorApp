import { useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import { Container } from './styles';
import { groupsGetAll } from 'src/storage/group/groupsGetAll';

export const Groups = () => {
  const [groups, setGroups] = useState<string[]>([]);

  const navigation = useNavigation();

  const fetchGroups = async () => {
    try {
      const data = await groupsGetAll()
      setGroups(data);
    } catch (error) {
      console.log(error);
    };
  };

  const handleOpenGroup = (group: string) => {
    navigation.navigate('players', { group });
  }

  const handleNewGroup = () => {
    navigation.navigate('new')
  };


  useFocusEffect(useCallback(() => {
    fetchGroups();
  }, []));

  return (
    <Container>
      <Header />

      <Highlight
        title='Turmas'
        subtitle='Jogue com a sua turma'
      />

      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard
            title={item}
            onPress={() => handleOpenGroup(item)}
          />
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <ListEmpty message="Que tal cadastrar a primeira turma?" />
        )}
        showsVerticalScrollIndicator={false}
      />

      <Button
        title='Criar nova turma'
        onPress={handleNewGroup}
      />

    </Container>
  );
};

