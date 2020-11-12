import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import dayjs from "dayjs";
import { RootStoreState } from "redux/store";
import { City } from "./citiesSlice";

export type WeatherData = {
  applicableDate: string;
  minTemperature: number;
  maxTemperature: number;
};

export type WeatherState = {
  cityName: string;
  weatherData: WeatherData[];
  status: "idle" | "loading" | "error" | "success";
  errorMessage?: string;
};

function fetchWeatherForecast(lon: string, lat: string) {
  return Axios.get(`/forecast`, {
    params: {
      lon: lon,
      lat: lat,
      product: "civillight",
      output: "json",
    },
  });
}

export const map7TimeWeatherData = (forecastData: { dataseries: { date: string; temp2m: { max: string; min: string } }[] }) => {
  return forecastData.dataseries.map(
    (w: any) =>
      ({
        applicableDate: dayjs(String(w.date)).toISOString(),
        maxTemperature: w.temp2m.max,
        minTemperature: w.temp2m.min,
      } as WeatherData)
  );
};

export const asyncFetchWeatherData = createAsyncThunk<WeatherState, City, { rejectValue: { errorMessage: string } }>(
  "weather/fetchData",
  async ({ cityName, longitude, latitude }, thunkApi) => {
    try {
      if (!longitude || !latitude) {
        return thunkApi.rejectWithValue({
          errorMessage: "Longitude or latitude cannot be empty",
        });
      }
      const forecastData = await fetchWeatherForecast(longitude, latitude).then((response) => response.data);
      return {
        cityName,
        weatherData: map7TimeWeatherData(forecastData),
      } as WeatherState;
    } catch (e) {
      return thunkApi.rejectWithValue({
        errorMessage: "An unknown error occurred. Please try again.",
      });
    }
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    status: "idle",
  } as WeatherState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchWeatherData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(asyncFetchWeatherData.fulfilled, (state, action) => {
        state.status = "success";
        state.weatherData = action.payload.weatherData;
        state.cityName = action.payload.cityName;
        state.errorMessage = undefined;
      })
      .addCase(asyncFetchWeatherData.rejected, (state, action) => {
        state.status = "error";
        state.errorMessage = action.payload?.errorMessage;
      });
  },
});

export default weatherSlice.reducer;
export const selectFiveDayWeather = (state: RootStoreState) => {
  const { weatherData } = state.weather;
  if(weatherData) {
    return weatherData.slice(0, 5);
  }
  return weatherData;
}
