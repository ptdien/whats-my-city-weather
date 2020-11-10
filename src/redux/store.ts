import { configureStore } from "@reduxjs/toolkit";
import weatherSlice, { WeatherState } from "./slices/weatherSlice";
import citiesSlice, { citiesSliceName, CitiesState } from "./slices/citiesSlice";

const store = configureStore({
  reducer: {
    weather: weatherSlice,
    [citiesSliceName]: citiesSlice,
  },
});
export default store;
export type RootStoreState = {
  weather: WeatherState;
  cities: CitiesState;
};
export type RootStoreDispatch = typeof store.dispatch;
