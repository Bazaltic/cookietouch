import LanguageManager from "@/configurations/language/LanguageManager";
import { BlockSpectatorScenarios } from "@/extensions/fights/configuration/enums/BlockSpectatorScenarios";
import { FightSpeeds } from "@/extensions/fights/configuration/enums/FightSpeeds";
import { FightStartPlacement } from "@/extensions/fights/configuration/enums/FightStartPlacement";
import { FightTactics } from "@/extensions/fights/configuration/enums/FightTactics";
import { SpellResistances } from "@/extensions/fights/configuration/enums/SpellResistances";
import { SpellTargets } from "@/extensions/fights/configuration/enums/SpellTargets";
import Spell from "@/extensions/fights/configuration/Spell";
import SpellEntry from "@/game/character/SpellEntry";
import Account from "@account";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormHelperText from "@material-ui/core/FormHelperText";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import withStyles, { StyleRulesCallback, WithStyles } from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import Tab from "@material-ui/core/Tab";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Tabs from "@material-ui/core/Tabs";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import * as React from "react";

type style = "root" | "appBar" | "tab" | "card" | "title" | "formControl" | "table" | "paper" | "modal" | "overflow";

const styles: StyleRulesCallback<style> = (theme) => ({
  appBar: {
    height: 30,
  },
  card: {
    minWidth: 275,
  },
  formControl: {
    margin: theme.spacing.unit,
  },
  modal: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    position: "absolute",
    width: theme.spacing.unit * 50,
  },
  overflow: {
    maxHeight: 400,
    overflowY: "auto",
  },
  paper: {
    color: theme.palette.text.secondary,
    margin: theme.spacing.unit,
    padding: theme.spacing.unit * 2,
  },
  root: {
    flexGrow: 1,
  },
  tab: {
    height: 30,
    maxWidth: 1000,
  },
  table: {
    minWidth: 700,
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

interface IAddSpellForm {
  spellId: number;
  target: SpellTargets;
  turns: number;
  relaunchs: number;
  targetHp: number;
  characterHp: number;
  resistance: SpellResistances;
  resistanceValue: number;
  distanceToClosestMonster: number;
  handToHand: boolean;
  aoe: boolean;
  carefulAoe: boolean;
  avoidAllies: boolean;
}

interface IState {
  activeTab: number;
  addSpellForm: IAddSpellForm;
  approachWhenNoSpellCasted: boolean;
  baseApproachAllMonsters: boolean;
  blockSpectatorScenario: BlockSpectatorScenarios;
  characterConnected: boolean;
  characterSpells: SpellEntry[];
  startPlacement: FightStartPlacement;
  ignoreSummonedEnemies: boolean;
  lockFight: boolean;
  maxCells: number;
  modalInfos: boolean;
  monsterToApproach: number;
  regenEnd: number;
  regenStart: number;
  spellToApproach: number;
  tactic: FightTactics;
  spells: Spell[];
  fightSpeed: FightSpeeds;
}

type Props = IProps & WithStyles<style>;

class Fights extends React.Component<Props, IState> {

  public state: IState = {
    activeTab: 0,
    addSpellForm: {
      aoe: false,
      avoidAllies: false,
      carefulAoe: false,
      characterHp: 100,
      distanceToClosestMonster: 0,
      handToHand: false,
      relaunchs: 1,
      resistance: SpellResistances.EARTH,
      resistanceValue: 100,
      spellId: -1,
      target: SpellTargets.ENEMY,
      targetHp: 100,
      turns: 1,
    },
    approachWhenNoSpellCasted: this.props.account.extensions.fights.config.approachWhenNoSpellCasted,
    baseApproachAllMonsters: this.props.account.extensions.fights.config.baseApproachAllMonsters,
    blockSpectatorScenario: this.props.account.extensions.fights.config.blockSpectatorScenario,
    characterConnected: false,
    characterSpells: [],
    fightSpeed: this.props.account.extensions.fights.config.fightSpeed,
    ignoreSummonedEnemies: this.props.account.extensions.fights.config.ignoreSummonedEnemies,
    lockFight: this.props.account.extensions.fights.config.lockFight,
    maxCells: this.props.account.extensions.fights.config.maxCells,
    modalInfos: false,
    monsterToApproach: this.props.account.extensions.fights.config.monsterToApproach,
    regenEnd: this.props.account.extensions.fights.config.regenEnd,
    regenStart: this.props.account.extensions.fights.config.regenStart,
    spellToApproach: this.props.account.extensions.fights.config.spellToApproach,
    spells: this.props.account.extensions.fights.config.spells,
    startPlacement: this.props.account.extensions.fights.config.startPlacement,
    tactic: this.props.account.extensions.fights.config.tactic,
  };

  public componentDidMount() {
    this.props.account.game.character.CharacterSelected.on(this.characterSelected);
    this.props.account.extensions.fights.config.Changed.on(this.configChanged);
    this.props.account.game.character.SpellsUpdated.on(this.spellsUpdated);
  }

  public componentWillUnmount() {
    this.props.account.game.character.CharacterSelected.off(this.characterSelected);
    this.props.account.extensions.fights.config.Changed.off(this.configChanged);
    this.props.account.game.character.SpellsUpdated.off(this.spellsUpdated);
  }

  public render() {
    const { classes } = this.props;

    return (
      <Paper className={classes.root}>
        <AppBar className={classes.appBar} position="static">
          <Tabs
            value={this.state.activeTab}
            onChange={this.handleChange}
            fullWidth
          >
            <Tab className={classes.tab} label={LanguageManager.trans("general")} />
            <Tab className={classes.tab} label={LanguageManager.trans("spells")} />
          </Tabs>
        </AppBar>

        <div style={{ display: this.state.activeTab !== 0 ? "none" : "" }}>
          <Grid container spacing={8}>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>{LanguageManager.trans("warmup")}</Typography>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="startPlacement">{LanguageManager.trans("startPlacement")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.startPlacement}
                      onChange={this.handleSelectChange}
                      inputProps={{ id: "startPlacement", name: "startPlacement" }}
                    >
                      <MenuItem value={FightStartPlacement.FAR_FROM_ENEMIES}>{LanguageManager.trans("farFromEnemies")}</MenuItem>
                      <MenuItem value={FightStartPlacement.CLOSE_TO_ENEMIES}>{LanguageManager.trans("closeToEnemies")}</MenuItem>
                      <MenuItem value={FightStartPlacement.STAY_STILL}>{LanguageManager.trans("stayStill")}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="monsterToApproach"
                    name="monsterToApproach"
                    label={LanguageManager.trans("approachMonster")}
                    helperText={LanguageManager.trans("monsterToApproachInfo")}
                    value={this.state.monsterToApproach}
                    fullWidth
                    onChange={this.handleSelectChange}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="spellToApproach"
                    name="spellToApproach"
                    label={LanguageManager.trans("spellToApproach")}
                    helperText={LanguageManager.trans("spellToApproachInfo")}
                    value={this.state.spellToApproach}
                    fullWidth
                    onChange={this.handleSelectChange}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="blockSpectatorScenario">{LanguageManager.trans("blockSpectator")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.blockSpectatorScenario}
                      onChange={this.handleSelectChange}
                      inputProps={{ id: "blockSpectatorScenario", name: "blockSpectatorScenario" }}
                    >
                      <MenuItem value={BlockSpectatorScenarios.ALWAYS}>{LanguageManager.trans("always")}</MenuItem>
                      <MenuItem value={BlockSpectatorScenarios.NEVER}>{LanguageManager.trans("never")}</MenuItem>
                      <MenuItem value={BlockSpectatorScenarios.WHEN_SOMEONE_JOINS}>{LanguageManager.trans("whenSomeoneJoins")}</MenuItem>
                    </Select>
                  </FormControl>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="lockFight"
                          name="lockFight"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.lockFight}
                          onChange={this.handleSwitchChange} />
                      }
                      label={LanguageManager.trans("lockFight")}
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>{LanguageManager.trans("duringFights")}</Typography>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="tactic">{LanguageManager.trans("tactic")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.tactic}
                      onChange={this.handleSelectChange}
                      inputProps={{ id: "tactic", name: "tactic" }}
                    >
                      <MenuItem value={FightTactics.AGGRESSIVE}>{LanguageManager.trans("aggressive")}</MenuItem>
                      <MenuItem value={FightTactics.FUGITIVE}>{LanguageManager.trans("fugitive")}</MenuItem>
                      <MenuItem value={FightTactics.PASSIVE}>{LanguageManager.trans("passive")}</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="fightSpeed">{LanguageManager.trans("fightSpeed")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.fightSpeed}
                      onChange={this.handleSelectChange}
                      inputProps={{ id: "fightSpeed", name: "fightSpeed" }}
                    >
                      <MenuItem value={FightSpeeds.SUICIDAL}>{LanguageManager.trans("suicidal")}</MenuItem>
                      <MenuItem value={FightSpeeds.FAST}>{LanguageManager.trans("fast")}</MenuItem>
                      <MenuItem value={FightSpeeds.NORMAL}>{LanguageManager.trans("normal")}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="maxCells"
                    name="maxCells"
                    label={LanguageManager.trans("maxCells")}
                    helperText={LanguageManager.trans("maxCells2")}
                    value={this.state.maxCells}
                    fullWidth
                    onChange={this.handleSelectChange}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="approachWhenNoSpellCasted"
                          name="approachWhenNoSpellCasted"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.approachWhenNoSpellCasted}
                          onChange={this.handleSwitchChange} />
                      }
                      label={LanguageManager.trans("approachWhenNoSpellCasted")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="baseApproachAllMonsters"
                          name="baseApproachAllMonsters"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.baseApproachAllMonsters}
                          onChange={this.handleSwitchChange} />
                      }
                      label={LanguageManager.trans("baseApproachAllMonsters")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="ignoreSummonedEnemies"
                          name="ignoreSummonedEnemies"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.ignoreSummonedEnemies}
                          onChange={this.handleSwitchChange} />
                      }
                      label={LanguageManager.trans("ignoreSummonedEnemies")}
                    />
                  </FormGroup>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={4}>
              <Card className={classes.card}>
                <CardContent>
                  <Typography className={classes.title}>{LanguageManager.trans("regeneration")}</Typography>
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="regenStart"
                    name="regenStart"
                    label={LanguageManager.trans("minimum")}
                    value={this.state.regenStart}
                    fullWidth
                    onChange={this.handleSelectChange}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="regenEnd"
                    name="regenEnd"
                    label={LanguageManager.trans("maximum")}
                    value={this.state.regenEnd}
                    fullWidth
                    onChange={this.handleSelectChange}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
        <div className={classes.overflow} style={{ display: this.state.activeTab !== 1 ? "none" : "" }}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell numeric>ID</TableCell>
                <TableCell>{LanguageManager.trans("name")}</TableCell>
                <TableCell>{LanguageManager.trans("target")}</TableCell>
                <TableCell numeric>{LanguageManager.trans("turns")}</TableCell>
                <TableCell numeric>{LanguageManager.trans("relaunchs")}</TableCell>
                <TableCell>CAC</TableCell>
                <TableCell>AOE</TableCell>
                <TableCell>{LanguageManager.trans("actions")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.spells.map((s, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell numeric>{s.spellId}</TableCell>
                    <TableCell>{s.spellName}</TableCell>
                    <TableCell>{SpellTargets[s.target]}</TableCell>
                    <TableCell numeric>{s.turns}</TableCell>
                    <TableCell numeric>{s.relaunchs}</TableCell>
                    <TableCell>{s.handToHand ? LanguageManager.trans("yes") : LanguageManager.trans("no")}</TableCell>
                    <TableCell>{s.aoe ? LanguageManager.trans("yes") : LanguageManager.trans("no")}</TableCell>
                    <TableCell>
                      <Button
                        disabled={this.state.characterConnected === false}
                        onClick={() => {
                          this.props.account.extensions.fights.config.spells = this.state.spells.filter((sp) => sp.spellId !== s.spellId);
                          this.props.account.extensions.fights.config.save();
                        }}
                        size="small"
                        variant="raised"
                        color="primary"
                      >
                        X
                    </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Card className={classes.card}>
            <CardContent>
              <Typography className={classes.title}>{LanguageManager.trans("addSpell")}</Typography>
              <Button
                onClick={() => this.setState({ modalInfos: true })}
                variant="raised"
                color="secondary"
              >
                {LanguageManager.trans("infos")}
              </Button>
              <form onSubmit={this.submit}>
                <Grid container spacing={8}>
                  <Grid item xs={6}>
                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="spellId">{LanguageManager.trans("spell")}</InputLabel>
                      <Select
                        disabled={this.state.characterConnected === false}
                        value={this.state.addSpellForm.spellId}
                        onChange={this.handleSelectChangeForm}
                        inputProps={{ id: "spellId", name: "spellId" }}
                      >
                        {this.state.characterSpells.map((s, index) => (
                          <MenuItem key={index} value={s.id}>{s.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="target">{LanguageManager.trans("target")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.addSpellForm.target}
                      onChange={this.handleSelectChangeForm}
                      inputProps={{ id: "target", name: "target" }}
                    >
                      <MenuItem value={SpellTargets.ALLY}>{LanguageManager.trans("ally")}</MenuItem>
                      <MenuItem value={SpellTargets.SELF}>{LanguageManager.trans("self")}</MenuItem>
                      <MenuItem value={SpellTargets.ENEMY}>{LanguageManager.trans("enemy")}</MenuItem>
                      <MenuItem value={SpellTargets.EMPTY_CELL}>{LanguageManager.trans("emptyCell")}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="turns"
                    name="turns"
                    label={LanguageManager.trans("turns")}
                    value={this.state.addSpellForm.turns}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="relaunchs"
                    name="relaunchs"
                    label={LanguageManager.trans("relaunchs")}
                    value={this.state.addSpellForm.relaunchs}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="targetHp"
                    name="targetHp"
                    label={`${LanguageManager.trans("targetLife")} <=`}
                    value={this.state.addSpellForm.targetHp}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="characterHp"
                    name="characterHp"
                    label={`${LanguageManager.trans("selfLife")} <=`}
                    value={this.state.addSpellForm.characterHp}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  </Grid>
                  <Grid item xs={6}>
                  <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="resistance">{LanguageManager.trans("resistance")}</InputLabel>
                    <Select
                      disabled={this.state.characterConnected === false}
                      value={this.state.addSpellForm.resistance}
                      onChange={this.handleSelectChangeForm}
                      inputProps={{ id: "resistance", name: "resistance" }}
                    >
                      <MenuItem value={SpellResistances.EARTH}>{LanguageManager.trans("earth")}</MenuItem>
                      <MenuItem value={SpellResistances.FIRE}>{LanguageManager.trans("fire")}</MenuItem>
                      <MenuItem value={SpellResistances.NEUTRAL}>{LanguageManager.trans("neutral")}</MenuItem>
                      <MenuItem value={SpellResistances.WATER}>{LanguageManager.trans("water")}</MenuItem>
                      <MenuItem value={SpellResistances.WIND}>{LanguageManager.trans("wind")}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="resistanceValue"
                    name="resistanceValue"
                    label={`${LanguageManager.trans("targetResistance")} <=`}
                    value={this.state.addSpellForm.resistanceValue}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    disabled={this.state.characterConnected === false}
                    autoFocus
                    margin="dense"
                    id="distanceToClosestMonster"
                    name="distanceToClosestMonster"
                    label={`${LanguageManager.trans("maxDistance")} <=`}
                    value={this.state.addSpellForm.distanceToClosestMonster}
                    fullWidth
                    onChange={this.handleSelectChangeForm}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                  />
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="handToHand"
                          name="handToHand"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.addSpellForm.handToHand}
                          onChange={this.handleSwitchChangeForm} />
                      }
                      label={LanguageManager.trans("melee")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="aoe"
                          name="aoe"
                          disabled={this.state.characterConnected === false}
                          color="primary"
                          checked={this.state.addSpellForm.aoe}
                          onChange={this.handleSwitchChangeForm} />
                      }
                      label={LanguageManager.trans("hitManyPossible")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="carefulAoe"
                          name="carefulAoe"
                          disabled={this.state.characterConnected === false || this.state.addSpellForm.aoe === false}
                          color="primary"
                          checked={this.state.addSpellForm.carefulAoe}
                          onChange={this.handleSwitchChangeForm} />
                      }
                      label={LanguageManager.trans("dontTouchSelf")}
                    />
                  </FormGroup>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          id="avoidAllies"
                          name="avoidAllies"
                          disabled={this.state.characterConnected === false || this.state.addSpellForm.aoe === false}
                          color="primary"
                          checked={this.state.addSpellForm.avoidAllies}
                          onChange={this.handleSwitchChangeForm} />
                      }
                      label={LanguageManager.trans("dontTouchAllies")}
                    />
                  </FormGroup>
                    <Button
                      type="submit"
                      variant="raised"
                      color="primary"
                    >
                      {LanguageManager.trans("add")}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </div>
        <Modal
          open={this.state.modalInfos}
          onClose={this.handleClose}
        >
          <div style={this.getModalStyle()} className={classes.modal}>
            <List dense>
              <ListItem><ListItemText primary={LanguageManager.trans("spellInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("targetInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("turnsInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("castPerTurnInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("targetLifeInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("characterLifeInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("resistanceInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("meleeInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("hitManyPossibleInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("dontTouchSelfInfo")} /></ListItem>
              <ListItem><ListItemText primary={LanguageManager.trans("dontTouchAlliesInfo")} /></ListItem>
            </List>
          </div>
        </Modal>
      </Paper>
    );
  }

  private submit = (event) => {
    event.preventDefault();

    const infos = this.state.addSpellForm;

    const name = this.state.characterSpells.find((s) => s.id === infos.spellId).name;

    const spell = new Spell(infos.spellId, name, infos.target, infos.turns,
      infos.relaunchs, infos.targetHp, infos.characterHp, infos.resistance,
      infos.resistanceValue, infos.distanceToClosestMonster, infos.handToHand,
      infos.aoe, infos.carefulAoe, infos.avoidAllies);

    this.props.account.extensions.fights.config.spells.push(spell);
    this.props.account.extensions.fights.config.save();
  }

  private getModalStyle = () => {
    const top = 50;
    const left = 50;

    return {
      left: `${left}%`,
      top: `${top}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  private handleClose = () => {
    this.setState({ modalInfos: false });
  }

  private handleChange = (event, value) => {
    this.setState({ activeTab: value });
  }

  private handleSwitchChange = (event, checked) => {
    this.setState({ [event.target.name]: checked } as Pick<IState, keyof IState>);
    this.props.account.extensions.fights.config[event.target.name] = checked;
    this.props.account.extensions.fights.config.save();
  }

  private handleSwitchChangeForm = (event, checked) => {
    const addSpellForm = { ...this.state.addSpellForm };
    addSpellForm[event.target.name] = checked;
    this.setState({ addSpellForm });
  }

  private handleSelectChangeForm = (event) => {
    const addSpellForm = { ...this.state.addSpellForm };
    addSpellForm[event.target.name] = event.target.value;
    this.setState({ addSpellForm });
  }

  private handleSelectChange = (event) => {
    this.setState({ [event.target.name]: event.target.value } as Pick<IState, keyof IState>);
    this.props.account.extensions.fights.config[event.target.name] = event.target.value;
    this.props.account.extensions.fights.config.save();
  }

  private configChanged = () => {
    this.setState({
      approachWhenNoSpellCasted: this.props.account.extensions.fights.config.approachWhenNoSpellCasted,
      baseApproachAllMonsters: this.props.account.extensions.fights.config.baseApproachAllMonsters,
      blockSpectatorScenario: this.props.account.extensions.fights.config.blockSpectatorScenario,
      fightSpeed: this.props.account.extensions.fights.config.fightSpeed,
      ignoreSummonedEnemies: this.props.account.extensions.fights.config.ignoreSummonedEnemies,
      lockFight: this.props.account.extensions.fights.config.lockFight,
      maxCells: this.props.account.extensions.fights.config.maxCells,
      monsterToApproach: this.props.account.extensions.fights.config.monsterToApproach,
      regenEnd: this.props.account.extensions.fights.config.regenEnd,
      regenStart: this.props.account.extensions.fights.config.regenStart,
      spellToApproach: this.props.account.extensions.fights.config.spellToApproach,
      spells: this.props.account.extensions.fights.config.spells,
      startPlacement: this.props.account.extensions.fights.config.startPlacement,
      tactic: this.props.account.extensions.fights.config.tactic,
    });
  }

  private characterSelected = () => {
    this.setState({ characterConnected: true });
  }

  private spellsUpdated = () => {
    this.setState({
      characterSpells: this.props.account.game.character.spells,
    }, () => {
      const addSpellForm = { ...this.state.addSpellForm };
      addSpellForm.spellId = this.state.characterSpells[0].id;
      this.setState({ addSpellForm });
    });
  }
}

export default withStyles(styles)<IProps>(Fights);
