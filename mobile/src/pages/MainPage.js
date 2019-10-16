import React from 'react';
import { Text, View } from 'react-native';
import { GiveawayList } from '../components/GiveawayList';

function MainPage() {
  return (
    <View>
      <View>
        <Text>VIEW PINNED GIVEAWAYS</Text>
      </View>
      <GiveawayList />
    </View>
  );
}

export { MainPage };