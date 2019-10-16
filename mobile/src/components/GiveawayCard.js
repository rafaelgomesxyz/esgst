import React from 'react';
import { Image, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Utils } from '../common/utils';

function GiveawayCard({ giveaway }) {
  return (
    <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1,flexDirection: 'row' }}>
      <Image source={{ uri: giveaway.thumbnail }} style={{ width: 100, resizeMode: 'stretch', }} />
      <View style={{flex:1,paddingHorizontal:5,paddingVertical:2}}>
        <Text>
          <Text style={{ color: '#324862', fontWeight: 'bold' }}>{giveaway.name}</Text>
          <Text style={{ color: '#6b7a8c', letterSpacing: 1, marginLeft: 5 }}>{`(${giveaway.points}P)`}</Text>
        </Text>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row',flex:1, justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <Icon name='clock-o' />
            <Text>{Utils.getTimeSince(giveaway.endTime, true)}</Text>
          </View>
          <Text>{`by ${giveaway.creator}`}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Icon name='tag' />
          <Text>{giveaway.entries}</Text>
          <Icon name='comment' />
          <Text>{giveaway.comments}</Text>
        </View>
      </View>
    </View>
  );
}

export { GiveawayCard };