import { Container, createMuiTheme, Grid, makeStyles, ThemeProvider } from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DayWeather from "./components/DayWeather";
import Search from "./components/Search";
import { asyncGetWeatherData } from "./redux/slices/weatherSlice";
import { RootStoreState } from "./redux/store";

function App() {
  const styles = useStyles();
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();
  const weatherData = useSelector((state: RootStoreState) => state.weather.weatherData);

  function handleSubmitSearch() {
    dispatch(asyncGetWeatherData({ cityName: searchQuery }));
  }
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: "#2196f3",
      },
      secondary: {
        main: "#76ff03",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <div className={"App " + styles.root}>
        <Grid container spacing={1}>
          <Grid item xs={12} spacing={3}>
            <Container maxWidth="sm">
              <Search value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onSubmit={handleSubmitSearch}></Search>
            </Container>
          </Grid>
          {weatherData && (
            <Grid container item xs={12} spacing={3}>
              {weatherData.map((w) => (
                <Grid item xs={6} md={3}>
                  <DayWeather dayIndex={new Date(w.applicableDate).getDay()} minTemperature={w.minTemperature} maxTemperature={w.maxTemperature}></DayWeather>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </div>
    </ThemeProvider>
  );
}

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "calc(10px + 2vmin)",
    color: "white",
    boxSizing: "border-box",
    padding: 20,
  },
});

export default App;
