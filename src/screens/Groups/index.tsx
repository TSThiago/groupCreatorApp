import { useState } from 'react';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';

import { Container } from './styles';
import { FlatList } from 'react-native';

export const Groups = () => {
  const [groups, setGroups] = useState<string[]>(['Galera da RocketSeat', 'Amigos', 'Galera do Ignite']);

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
          />
        )}
      />

    </Container>
  );
};

