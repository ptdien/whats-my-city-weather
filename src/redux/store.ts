import { configureStore } from "@reduxjs/toolkit";
import weatherSlice, { WeatherState } from "./slices/weatherSlice";
import citiesSlice, { citiesSliceName, CitiesState } from "./slices/citiesSlice";

export const makeStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      weather: weatherSlice,
      [citiesSliceName]: citiesSlice,
    },
    preloadedState,
  });
const store = makeStore();
export default store;
export type RootStoreState = {
  weather: WeatherState;
  cities: CitiesState;
};
export type RootStoreDispatch = typeof store.dispatch;
