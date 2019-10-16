import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { DOM } from '../services/DOM';
import { Giveaway } from '../common/parsers/Giveaway';
import { GiveawayCard } from './GiveawayCard';

function GiveawayList() {
  const [state, setState] = useState({
    giveaways: [],
    pinnedGiveaways: [],
    isLoading: true,
    page: 1,
    refreshTimeout: null,
  });

  async function loadNextBatch() {
    try {
      const response = await fetch(`https://www.steamgifts.com/giveaways/search?page=${state.page}`);
      const text = await response.text();
      const context = DOM.parse(text);

      const _giveaways = [];

      const giveawayElements = Array.from(context.querySelectorAll('.giveaway__row-outer-wrap'));

      for (const giveawayElement of giveawayElements) {
        const giveaway = new Giveaway();

        giveaway.parse(giveawayElement);

        _giveaways.push(giveaway.data);
      }

      setState({
        giveaways: [...state.giveaways, ..._giveaways].sort((a, b) => a.endTime < b.endTime ? -1 : 1),
        isLoading: false,
        page: state.page + 1,
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  function refresh(state) {
    const now = Date.now();

    const num = state.giveaways.length;
    const _giveaways = state.giveaways.filter(x => now < x.endTime);
    const newNum = _giveaways.length;

    setState({
      giveaways: _giveaways,
      isLoading: false,
      page: state.page,
    });
    if (num == newNum) {
      state.refreshTimeout = setTimeout(refresh, 5000, state);
    }
  }

  useEffect(() => {
    loadNextBatch();
  }, []);

  useEffect(() => {
    if (state.refreshTimeout) {
      clearTimeout(state.refreshTimeout);
      state.refreshTimeout = null;
    }
    state.refreshTimeout = setTimeout(refresh, 5000, state);
  }, [state.giveaways]);

  return (
    <View>
      {state.isLoading ? (
        <ActivityIndicator size='large' />
      ) : (
        <View>
          <TouchableOpacity>VIEW PINNED GIVEAWAYS</TouchableOpacity>
          <FlatList
            data={state.giveaways}
            extraData={state.giveaways}
            keyExtractor={item => item.code}
            renderItem={({ item }) => <GiveawayCard giveaway={item} />}
          />
          <FlatList
            data={state.giveaways}
            extraData={state.giveaways}
            keyExtractor={item => item.code}
            renderItem={({ item }) => <GiveawayCard giveaway={item} />}
          />
        </View>
      )}
    </View>
  );
}

export { GiveawayList };