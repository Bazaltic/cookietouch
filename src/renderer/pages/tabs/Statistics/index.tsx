import LanguageManager from "@/configurations/language/LanguageManager";
import { displayTime } from "@/utils/Time";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import { statisticsTabStyles } from "@renderer/pages/tabs/Statistics/styles";
import {
  IStatisticsTabProps,
  IStatisticsTabState,
  StatisticsTabProps
} from "@renderer/pages/tabs/Statistics/types";
import * as React from "react";

class Statistics extends React.Component<
  StatisticsTabProps,
  IStatisticsTabState
> {
  public state: IStatisticsTabState = {
    achievementsFinished: 0,
    averageFightTime: 0,
    experienceGained: 0,
    fightsCount: 0,
    fightsLost: 0,
    fightsWon: 0,
    gathersCount: 0,
    kamasGained: 0,
    levelsGained: 0,
    objectsObtainedInFights: [],
    objectsObtainedInGathers: [],
    totalFightsTime: 0,
    totalGathersTime: 0
  };

  public componentDidMount() {
    this.props.account.statistics.StatisticsUpdated.on(this.statisticsUpdated);
  }

  public componentWillUnmount() {
    this.props.account.statistics.StatisticsUpdated.off(this.statisticsUpdated);
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container={true} spacing={8}>
          <Grid item={true} xs={2}>
            <Typography>
              {LanguageManager.trans("achievementsFinished")}{" "}
              {this.state.achievementsFinished}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("averageFightTime")}{" "}
              {displayTime(this.state.averageFightTime)}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("experienceGained")}{" "}
              {this.state.experienceGained}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("fightsCount")} {this.state.fightsCount}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("fightsLost")} {this.state.fightsLost}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("fightsWon")} {this.state.fightsWon}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("gathersCount")} {this.state.gathersCount}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("kamasGained") + ":"}{" "}
              {this.state.kamasGained}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("levelsGained")} {this.state.levelsGained}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("totalFightsTime")}{" "}
              {displayTime(this.state.totalFightsTime)}
            </Typography>
            <br />
            <Typography>
              {LanguageManager.trans("totalGathersTime")}{" "}
              {displayTime(this.state.totalGathersTime)}
            </Typography>
          </Grid>
          <Grid item={true} xs={10}>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={6}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell numeric={true}>GID</TableCell>
                      <TableCell>{LanguageManager.trans("name")}</TableCell>
                      <TableCell numeric={true}>%</TableCell>
                      <TableCell numeric={true}>
                        {LanguageManager.trans("quantity")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.objectsObtainedInFights.map((o, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell numeric={true}>{o.gid}</TableCell>
                          <TableCell>{o.name}</TableCell>
                          <TableCell>
                            <Typography>{o.percentage.toFixed(2)}%</Typography>
                            <LinearProgress
                              style={{ height: 16 }}
                              variant="determinate"
                              value={o.percentage}
                            />
                          </TableCell>
                          <TableCell numeric={true}>{o.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
              <Grid item={true} xs={6}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell numeric={true}>GID</TableCell>
                      <TableCell>{LanguageManager.trans("name")}</TableCell>
                      <TableCell numeric={true}>%</TableCell>
                      <TableCell numeric={true}>
                        {LanguageManager.trans("quantity")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.objectsObtainedInGathers.map((o, index) => {
                      return (
                        <TableRow key={index}>
                          <TableCell numeric={true}>{o.gid}</TableCell>
                          <TableCell>{o.name}</TableCell>
                          <TableCell>
                            <Typography>{o.percentage.toFixed(2)}%</Typography>
                            <LinearProgress
                              style={{ height: 16 }}
                              variant="determinate"
                              value={o.percentage}
                            />
                          </TableCell>
                          <TableCell numeric={true}>{o.quantity}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  }

  private statisticsUpdated = () => {
    this.setState({
      achievementsFinished: this.props.account.statistics.achievementsFinished,
      averageFightTime: this.props.account.statistics.averageFightTime,
      experienceGained: this.props.account.statistics.experienceGained,
      fightsCount: this.props.account.statistics.fightsCount,
      fightsLost: this.props.account.statistics.fightsLost,
      fightsWon: this.props.account.statistics.fightsWon,
      gathersCount: this.props.account.statistics.gathersCount,
      kamasGained: this.props.account.statistics.kamasGained,
      levelsGained: this.props.account.statistics.levelsGained,
      objectsObtainedInFights: this.props.account.statistics.objectsObtainedInFights.ToArray(),
      objectsObtainedInGathers: this.props.account.statistics.objectsObtainedInGathers.ToArray(),
      totalFightsTime: this.props.account.statistics.totalFightsTime,
      totalGathersTime: this.props.account.statistics.totalGathersTime
    });
  };
}

export default withStyles(statisticsTabStyles)<IStatisticsTabProps>(Statistics);
