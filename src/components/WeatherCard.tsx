import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import React from "react";

const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayWeather({ dayIndex, minTemperature, maxTemperature }: { dayIndex: number; minTemperature: number; maxTemperature: number }) {
  const styles = useStyles();
  return (
    <Card className={styles.root} variant="outlined">
      <CardContent className={styles.content}>
        <Typography variant="h6" className={styles.title} color="textPrimary" gutterBottom>
          {Days[dayIndex]}
        </Typography>
        <Typography className={styles.title} color="textSecondary" gutterBottom>
          Min: {Number(minTemperature).toFixed(0)}&#8451;
        </Typography>
        <Typography className={styles.title} color="textSecondary" gutterBottom>
          Max: {Number(maxTemperature).toFixed(0)}&#8451;
        </Typography>
      </CardContent>
    </Card>
  );
}

const useStyles = makeStyles({
  root: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  content: {
    textAlign: "center",
  },
  title: {},
});
