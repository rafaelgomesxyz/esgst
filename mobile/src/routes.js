import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import { MainPage } from './pages/MainPage';

const Routes = createAppContainer(
  createSwitchNavigator({
    MainPage,
  })
);

export { Routes };