import { Card, CardContent, Typography, makeStyles } from "@material-ui/core";
import React from "react";

const Days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function DayWeather({ dayIndex, minTemperature, maxTemperature }: { dayIndex: number; minTemperature: number; maxTemperature: number }) {
  const styles = useStyles();
  return (
    <Card className={styles.root} variant="outlined">
      <CardContent>
        <Typography className={styles.title} color="textSecondary" gutterBottom>
          {Days[dayIndex]}
        </Typography>
        <Typography className={styles.title} color="textSecondary" gutterBottom>
          {Number(minTemperature).toFixed(0)}
        </Typography>
        <Typography className={styles.title} color="textSecondary" gutterBottom>
          {Number(maxTemperature).toFixed(0)}
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
  title: {},
});
