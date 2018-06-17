import LanguageManager from "@/configurations/language/LanguageManager";
import ObjectToSellEntry from "@/extensions/bid/ObjectToSellEntry";
import DataManager from "@/protocol/data";
import Items from "@/protocol/data/classes/Items";
import { DataTypes } from "@/protocol/data/DataTypes";
import Account from "@account";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import withStyles, { StyleRulesCallback, WithStyles } from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { remote } from "electron";
import { List } from "linqts";
import * as React from "react";

type style = "root" | "table" | "card" | "title" | "formControl";

const styles: StyleRulesCallback<style> = (theme) => ({
  card: {
    minWidth: 275,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  root: {
    flexGrow: 1,
    maxHeight: 500,
    overflowY: "auto",
  },
  table: {
    maxWidth: 400,
    minWidth: 200,
  },
  title: {
    color: theme.palette.text.secondary,
    fontSize: 14,
    marginBottom: 16,
  },
});

interface IProps {
  account: Account;
}

interface IAddObjectForm {
  gid: number;
  lot: number;
  quantity: number;
  minPrice: number;
  basePrice: number;
}

interface IState {
  addObjectForm: IAddObjectForm;
  characterConnected: boolean;
  kamasGained: number;
  kamasPaidOnTaxes: number;
  interval: number;
  objects: ObjectToSellEntry[];
  running: boolean;
  script: string;
}

type Props = IProps & WithStyles<style>;

class Bid extends React.Component<Props, IState> {

  public state: IState = {
    addObjectForm: {
      basePrice: 1,
      gid: -1,
      lot: 1,
      minPrice: 1,
      quantity: 1,
    },
    characterConnected: false,
    interval: -1,
    kamasGained: -1,
    kamasPaidOnTaxes: -1,
    objects: [],
    running: false,
    script: "",
  };

  public componentDidMount() {
    this.props.account.game.character.CharacterSelected.on(this.characterSelected);
    this.props.account.extensions.bid.config.Changed.on(this.configChanged);
    this.props.account.extensions.bid.Started.on(this.started);
    this.props.account.extensions.bid.Stopped.on(this.stopped);
    this.props.account.extensions.bid.StatisticsUpdated.on(this.statisticsUpdated);
  }

  public componentWillUnmount() {
    this.props.account.game.character.CharacterSelected.off(this.characterSelected);
    this.props.account.extensions.bid.config.Changed.off(this.configChanged);
    this.props.account.extensions.bid.Started.off(this.started);
    this.props.account.extensions.bid.Stopped.off(this.stopped);
    this.props.account.extensions.bid.StatisticsUpdated.off(this.statisticsUpdated);
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={4}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    disabled={this.state.characterConnected === false}
                    color="primary"
                    checked={this.state.running}
                    onChange={(event, checked) => {
                      if (this.state.running) {
                        this.props.account.extensions.bid.stop();
                      } else {
                        this.props.account.extensions.bid.start();
                      }
                    }}
                  />
                }
                label={LanguageManager.trans("active")}
              />
            </FormGroup>
            <TextField
              disabled={this.state.characterConnected === false}
              autoFocus
              margin="dense"
              id="interval"
              name="interval"
              label={LanguageManager.trans("interval")}
              value={this.state.interval}
              fullWidth
              onChange={this.handleInputChange}
              type="number"
              InputLabelProps={{ shrink: true }}
            />
            <Typography>{LanguageManager.trans("kamasGained")}: {this.state.kamasGained}</Typography><br />
            <Typography>{LanguageManager.trans("kamasTaxes")}: {this.state.kamasPaidOnTaxes}</Typography><br />
            <Typography>Script: {this.state.script}</Typography>
            <Button
              size="small"
              style={{ marginLeft: "15px" }}
              onClick={() => {
                remote.dialog.showOpenDialog({
                  filters: [
                    { name: "Cookie Scripts Format", extensions: ["js"] },
                  ],
                  properties: ["openFile"],
                }, (filepaths) => {
                  const filepath = filepaths[0];
                  this.props.account.extensions.bid.config.scriptPath = filepath;
                  this.props.account.extensions.bid.config.save();
                });
              }}
              variant="raised"
              color="primary"
            >
              {LanguageManager.trans("load")}
            </Button>
            <Button
              size="small"
              style={{ marginLeft: "15px" }}
              onClick={() => {
                  this.props.account.extensions.bid.config.scriptPath = "";
                  this.props.account.extensions.bid.config.save();
              }}
              variant="raised"
              color="primary"
            >
              {LanguageManager.trans("unload")}
            </Button>
            <Card className={classes.card}>
              <CardContent>
                <Typography className={classes.title}>{LanguageManager.trans("addItem")}</Typography>
                <form onSubmit={this.submit}>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="gid"
                    name="gid"
                    label="GID"
                    value={this.state.addObjectForm.gid}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="lot">{LanguageManager.trans("lot")}</InputLabel>
                    <Select
                      value={this.state.addObjectForm.lot}
                      onChange={this.handleSelectChangeForm}
                      inputProps={{ id: "lot", name: "lot" }}
                    >
                      <MenuItem value={1}>1</MenuItem>
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="quantity"
                    name="quantity"
                    label={LanguageManager.trans("quantity")}
                    value={this.state.addObjectForm.quantity}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="minPrice"
                    name="minPrice"
                    label={LanguageManager.trans("minPrice")}
                    value={this.state.addObjectForm.minPrice}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    autoFocus
                    margin="dense"
                    id="basePrice"
                    name="basePrice"
                    label={LanguageManager.trans("basePrice")}
                    value={this.state.addObjectForm.basePrice}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <Button
                    type="submit"
                    variant="raised"
                    color="primary"
                  >
                    {LanguageManager.trans("add")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={8}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell numeric>GID</TableCell>
                  <TableCell>{LanguageManager.trans("name")}</TableCell>
                  <TableCell numeric>{LanguageManager.trans("lot")}</TableCell>
                  <TableCell numeric>{LanguageManager.trans("quantity")}</TableCell>
                  <TableCell numeric>{LanguageManager.trans("minPrice")}</TableCell>
                  <TableCell numeric>{LanguageManager.trans("basePrice")}</TableCell>
                  <TableCell>{LanguageManager.trans("actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.objects.map((o, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell>{o.gid}</TableCell>
                      <TableCell>{o.name}</TableCell>
                      <TableCell>{o.lot}</TableCell>
                      <TableCell>{o.quantity}</TableCell>
                      <TableCell>{o.minPrice}</TableCell>
                      <TableCell>{o.basePrice}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => this.deleteObject(o)}
                          variant="raised"
                          color="primary"
                        >
                          {LanguageManager.trans("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </div>
    );
  }

  private submit = async (event) => {
    event.preventDefault();

    const infos = this.state.addObjectForm;

    const objResp = await DataManager.get<Items>(DataTypes.Items, infos.gid);
    if (objResp.length === 0) {
      return;
    }
    const name = objResp[0].object.nameId;

    this.props.account.extensions.bid.config.objectsToSell.Add(
      new ObjectToSellEntry(name, infos.gid, infos.lot, infos.quantity, infos.minPrice, infos.basePrice),
    );
    this.props.account.extensions.bid.config.save();
  }

  private handleSelectChangeForm = (event) => {
    const addObjectForm = { ...this.state.addObjectForm };
    addObjectForm[event.target.name] = event.target.value;
    this.setState({ addObjectForm });
  }

  private handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    this.setState({ [event.target.name]: value } as Pick<IState, keyof IState>);
    this.props.account.extensions.bid.config[event.target.name] = value;
    this.props.account.extensions.bid.config.save();
  }

  private deleteObject = (obj: ObjectToSellEntry) => {
    const objects = this.state.objects.filter((o) => o.gid !== obj.gid);
    this.props.account.extensions.bid.config.objectsToSell = new List(objects);
    this.props.account.extensions.bid.config.save();
  }

  private characterSelected = () => {
    this.setState({ characterConnected: true });
  }

  private configChanged = () => {
    this.setState({
      interval: this.props.account.extensions.bid.config.interval,
      objects: this.props.account.extensions.bid.config.objectsToSell.ToArray(),
      script: this.props.account.extensions.bid.config.scriptPath,
    });
  }

  private started = () => {
    this.setState({ running: true });
  }

  private stopped = () => {
    this.setState({ running: false });
  }

  private statisticsUpdated = () => {
    this.setState({
      kamasGained: this.props.account.extensions.bid.kamasGained,
      kamasPaidOnTaxes: this.props.account.extensions.bid.kamasPaidOnTaxes,
    });
  }
}

export default withStyles(styles)<IProps>(Bid);
