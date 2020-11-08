import { configureStore } from "@reduxjs/toolkit";
import weatherSlice, { WeatherState } from "./slices/weatherSlice";

const store = configureStore({
  reducer: {
    weather: weatherSlice,
  },
});
export default store;
export type RootStoreState = {
  weather: WeatherState;
};
export type RootStoreDispatch = typeof store.dispatch;
