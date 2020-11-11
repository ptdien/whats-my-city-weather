import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export type City = {
  cityName: string;
  longitude: string;
  latitude: string;
  woeid: number;
};

export type CitiesState = {
  status: "idle" | "loading" | "error" | "success";
  cities: City[];
  errorMessage?: string;
};

export const mapMetaWeatherLocationResponse = (response: { woeid: number; title: string; latt_long: string }[]) => {
  return response.map((c) => {
    const [latitude, longitude] = c.latt_long.split(",");
    return {
      cityName: c.title,
      latitude,
      longitude,
      woeid: c.woeid,
    };
  }) as City[];
};

export const asyncFetchCityNames = createAsyncThunk<City[], string, { rejectValue: { errorMessage: string } }>(
  "cities/fetchCityNames",
  async (query: string, thunkApi) => {
    try {
      if (!query) {
        return [] as City[];
      }
      const responseCities: { woeid: number; title: string; latt_long: string }[] = await fetchCityNames(query);
      if (!responseCities || !responseCities.length) {
        return [] as City[];
      }
      return mapMetaWeatherLocationResponse(responseCities);
    } catch (e) {
      return thunkApi.rejectWithValue({
        errorMessage: "An unknown error occurred. Please try again.",
      });
    }
  }
);

const citiesSlice = createSlice({
  name: "cities",
  initialState: {
    cities: [],
    status: "idle",
  } as CitiesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(asyncFetchCityNames.pending, (state) => {
        state.status = "loading";
      })
      .addCase(asyncFetchCityNames.fulfilled, (state, action) => {
        state.status = "success";
        state.cities = action.payload;
        state.errorMessage = undefined;
      })
      .addCase(asyncFetchCityNames.rejected, (state, action) => {
        state.status = "error";
        state.errorMessage = action.payload?.errorMessage;
      });
  },
});

function fetchCityNames(query: string) {
  return Axios.get(`/location/search/?query=${query}`).then((response) => response.data);
}

export default citiesSlice.reducer;
export const citiesSliceName = citiesSlice.name;
