import { Grid, LinearProgress, makeStyles, Typography } from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import CitySearch from "components/CitySearch";
import WeatherCard from "components/WeatherCard";
import { City } from "redux/slices/citiesSlice";
import { asyncFetchWeatherData } from "redux/slices/weatherSlice";
import { RootStoreState } from "redux/store";

export default function App() {
  const styles = useStyles();
  const dispatch = useDispatch();
  const weatherData = useSelector((state: RootStoreState) => state.weather.weatherData);
  const cityName = useSelector((state: RootStoreState) => state.weather.cityName);
  const status = useSelector((state: RootStoreState) => state.weather.status);

  function handleSubmitSearch(city: City | null) {
    dispatch(asyncFetchWeatherData(city!));
  }

  return (
    <div className={clsx("App", styles.root)}>
      {status === "loading" && <LinearProgress className={styles.progressBar} />}
      <Grid container spacing={3} alignItems="center" justify="center">
        <Grid container item xs={12} spacing={3} className={styles.weatherCards} alignItems="center" justify="flex-start">
          <Grid item xs={12} className={styles.citySearch}>
            <CitySearch label={"City Search"} onChange={handleSubmitSearch} />
          </Grid>
          {weatherData && (
            <>
              <Grid item xs={12}>
                <Typography variant="h5" color="textPrimary" gutterBottom>
                  {cityName}
                </Typography>
              </Grid>
              {weatherData.map((w) => (
                <Grid item xs={6} md={3} key={w.applicableDate}>
                  <WeatherCard dayIndex={new Date(w.applicableDate).getDay()} minTemperature={w.minTemperature} maxTemperature={w.maxTemperature}></WeatherCard>
                </Grid>
              ))}
            </>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles({
  root: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    boxSizing: "border-box",
    flexDirection: "column",
    padding: 20,
    position: "relative",
  },
  weatherCards: {},
  citySearch: {},
  progressBar: {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
});
