import PathDuration from "@/core/pathfinder/PathDuration";
import FighterEntry from "@/game/fight/fighters/FighterEntry";
import FightMonsterEntry from "@/game/fight/fighters/FightMonsterEntry";
import FightPlayerEntry from "@/game/fight/fighters/FightPlayerEntry";
import { MapChangeDirections } from "@/game/managers/movements/MapChangeDirections";
import MonstersGroupEntry from "@/game/map/entities/MonstersGroupEntry";
import NpcEntry from "@/game/map/entities/NpcEntry";
import PlayerEntry from "@/game/map/entities/PlayerEntry";
import ElementInCellEntry from "@/game/map/interactives/ElementInCellEntry";
import StatedElementEntry from "@/game/map/interactives/StatedElementEntry";
import DataManager, { IDataResponse } from "@/protocol/data";
import Items from "@/protocol/data/classes/Items";
import Skills from "@/protocol/data/classes/Skills";
import { DataTypes } from "@/protocol/data/DataTypes";
import DTConstants from "@/protocol/DTConstants";
import Color from "@/utils/Color";
import Point from "@/utils/Point";
import { sleep } from "@/utils/Time";
import Account from "@account";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Grid from "@material-ui/core/Grid";
import withStyles, { StyleRulesCallback, WithStyles } from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import { List } from "linqts";
import * as React from "react";
import MapViewerCell from "./MapViewerCell";

type style = "root";

const styles: StyleRulesCallback<style> = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

interface IProps {
  account: Account;
}

interface IState {
  path: number[];
  selectedCellId: number;
  showCellIds: boolean;
  showReal: boolean;
}

type Props = IProps & WithStyles<style>;

class MapViewer extends React.Component<Props, IState> {

  public cells: List<MapViewerCell>;

  private readonly walkableCellBrush = new Color(145, 145, 148);
  private readonly losCellBrush = new Color(77, 77, 77);
  private readonly obstacleCellBrush = new Color(45, 45, 48);
  private readonly selectedCellBrush = new Color(255, 91, 90, 90);
  private readonly ourPlayerBrush = new Color(0, 0, 255);
  private readonly monstersGroupsBrush = new Color(255, 139, 0, 0);
  private readonly playersBrush = new Color(255, 81, 113, 202);
  private readonly doorsBrush = new Color(255, 150, 75, 133);
  private readonly interactivesBrush = new Color(255, 1, 143, 140);
  private readonly npcsBrush = new Color(255, 179, 120, 211);
  private readonly sunImage = "21000.png";
  private readonly phenixImage = "7521.png";
  private readonly lockedStorageImage = "12367.png";

  constructor(props: Props) {
    super(props);

    this.state = {
      path: [],
      selectedCellId: -1,
      showCellIds: false,
      showReal: false,
    };

    this.initCells();
  }

  public componentDidMount() {
    const c = this.refs.canvas as HTMLCanvasElement;
    c.addEventListener("click", this.onMouseClick, false);
    c.addEventListener("mousemove", this.onMouseMove, false);

    this.props.account.game.map.MapChanged.on(this.refreshMapViewer);
    this.props.account.game.map.EntitiesUpdated.on(this.refreshMapViewer);
    this.props.account.game.map.InteractivesUpdated.on(this.refreshMapViewer);
    this.props.account.game.map.PlayedCharacterMoving.on(this.playedCharacterMoving);
    this.props.account.game.fight.FightJoined.on(this.refreshMapViewer);
    this.props.account.game.fight.PossiblePositionsReceived.on(this.refreshMapViewer);
    this.props.account.game.fight.FightStarted.on(this.refreshMapViewer);
    this.props.account.game.fight.FightersUpdated.on(this.refreshMapViewer);
    this.props.account.game.fight.PlayedFighterMoving.on(this.playedCharacterMoving);
  }

  public componentWillUnmount() {
    const c = this.refs.canvas as HTMLCanvasElement;
    c.removeEventListener("click", this.onMouseClick, false);
    c.removeEventListener("mousemove", this.onMouseMove, false);

    this.props.account.game.map.MapChanged.off(this.refreshMapViewer);
    this.props.account.game.map.EntitiesUpdated.off(this.refreshMapViewer);
    this.props.account.game.map.InteractivesUpdated.off(this.refreshMapViewer);
    this.props.account.game.map.PlayedCharacterMoving.off(this.playedCharacterMoving);
    this.props.account.game.fight.FightJoined.off(this.refreshMapViewer);
    this.props.account.game.fight.PossiblePositionsReceived.off(this.refreshMapViewer);
    this.props.account.game.fight.FightStarted.off(this.refreshMapViewer);
    this.props.account.game.fight.FightersUpdated.off(this.refreshMapViewer);
    this.props.account.game.fight.PlayedFighterMoving.off(this.playedCharacterMoving);
  }

  public render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={8}>
          <Grid item xs={10}>
            <img style={{ display: "none" }} id="mapimg" />
            {this.props.account.game.map.data ? this.props.account.game.map.data.midgroundLayer.keys().map((cellId, index) => (
              this.props.account.game.map.data.midgroundLayer.getValue(cellId).map((g, index2) => (
                g.g ? <img key={`${index}-${index2}`} style={{ display: "none" }} id={`g-${cellId}-${g.g}`} /> : ""
              ))
            )) : ""}
            <div id="tooltip"></div>
            <canvas id="mapStatus"
              ref="canvas"
              width={DTConstants.TILE_WIDTH * (DTConstants.MAP_WIDTH + 0.5)}
              height={DTConstants.TILE_HEIGHT * (DTConstants.MAP_HEIGHT + 0.5)}></canvas>
          </Grid>
          <Grid item xs={2}>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={this.state.showCellIds}
                    onChange={(event) => {
                      this.setState({ showCellIds: event.target.checked }, () => this.buildMap());
                    }} />
                }
                label="Cells ID"
              />
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    checked={this.state.showReal}
                    onChange={(event) => {
                      this.setState({ showReal: event.target.checked }, () => this.buildMap());
                    }} />
                }
                label="Real MAP"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </div>
    );
  }

  private refreshMapViewer = () => {
    this.buildMap();
  }
  private playedCharacterMoving = async (cells: number[]) => {
    this.setState({ path: cells }, () => this.buildMap());
    if (!this.props.account.config.enableSpeedHack) {
      const num = PathDuration.calculate(cells);
      await sleep(num);
    } else {
      if (this.props.account.isFighting) {
        const num = PathDuration.calculate(cells);
        await sleep(num);
      }
      await sleep(200);
    }
    if (this.state.path.length > 0) {
      this.setState({ path: [] }, () => this.buildMap());
    }
  }
  private getCellBrush = (cell: number): Color => {
    // In case the cell is currently selected
    if (cell === this.state.selectedCellId) {
      return this.selectedCellBrush;
    }
    // In case the cell is a possible placement
    if (this.props.account.isFighting && this.props.account.game.fight.positionsForChallengers.Contains(cell) === true) {
      return new Color(255, 0, 0);
    }
    if (this.props.account.isFighting && this.props.account.game.fight.positionsForDefenders.Contains(cell) === true) {
      return new Color(0, 0, 255);
    }
    let brush = this.losCellBrush;
    if (!this.props.account.game.map.data) {
      return brush;
    }
    if (this.props.account.game.map.data.cells[cell].isObstacle()) {
      brush = this.obstacleCellBrush;
    } else if (this.props.account.game.map.data.cells[cell].isWalkable(this.props.account.isFighting)) {
      brush = this.walkableCellBrush;
    }
    return brush;
  }
  private drawTileContent = (drawingContext: CanvasRenderingContext2D, cellId: number) => {
    if (this.props.account.isFighting) {
      if (this.props.account.game.fight.playedFighter &&
        this.props.account.game.fight.playedFighter.cellId === cellId) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.ourPlayerBrush);
      } else if (this.props.account.game.fight.allies.find((a) => a.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.playersBrush);
      } else if (this.props.account.game.fight.enemies.find((e) => e.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.monstersGroupsBrush);
      }
    } else {
      if (this.props.account.game.map.playedCharacter &&
        this.props.account.game.map.playedCharacter.cellId === cellId) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.ourPlayerBrush);
      } else if (this.props.account.game.map.monstersGroups.find((mg) => mg.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.monstersGroupsBrush);
      } else if (this.props.account.game.map.players.find((p) => p.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.playersBrush);
      } else if (this.props.account.game.map.doors.find((d) => d.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawRectangle(drawingContext, this.doorsBrush);
      } else if (this.props.account.game.map.statedElements.find((se) => se.cellId === cellId) !== undefined ||
        this.props.account.game.map.zaap && this.props.account.game.map.zaap.cellId === cellId ||
        this.props.account.game.map.zaapi && this.props.account.game.map.zaapi.cellId === cellId) {
        this.cells.ElementAt(cellId).DrawRectangle(drawingContext, this.interactivesBrush);
      } else if (this.props.account.game.map.npcs.find((n) => n.cellId === cellId) !== undefined) {
        this.cells.ElementAt(cellId).DrawPie(drawingContext, this.npcsBrush);
      }
    }
  }
  private initCells = () => {
    this.cells = new List<MapViewerCell>();
    let cell = 0;
    for (let i = 0; i < DTConstants.MAP_HEIGHT; i++) {
      for (let j = 0; j < DTConstants.MAP_WIDTH * 2; j++) {
        const coords = this.cellCoords(cell);
        const x = coords.x;
        const y = coords.y;
        const startPtX = x * (DTConstants.TILE_WIDTH) + (y % 2 === 1 ? (DTConstants.TILE_WIDTH) / 2 : 0);
        const startPtY = y * (DTConstants.TILE_HEIGHT) / 2;
        this.cells.Add(new MapViewerCell([
          new Point(startPtX + (DTConstants.TILE_WIDTH) / 2, startPtY),
          new Point(startPtX + (DTConstants.TILE_WIDTH), startPtY + (DTConstants.TILE_HEIGHT) / 2),
          new Point(startPtX + (DTConstants.TILE_WIDTH) / 2, startPtY + (DTConstants.TILE_HEIGHT)),
          new Point(startPtX, startPtY + (DTConstants.TILE_HEIGHT) / 2),
        ]));
        cell++;
      }
    }
  }
  private cellCoords = (cellId: number) => {
    return {
      x: cellId % DTConstants.MAP_WIDTH,
      y: Math.floor(cellId / DTConstants.MAP_WIDTH),
    };
  }
  private buildMap = () => {
    const c = this.refs.canvas as HTMLCanvasElement;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, c.width, c.height);
    if (this.state.showReal) {
      this.walkableCellBrush.a = 0.5;
      this.losCellBrush.a = 0.5;
      this.obstacleCellBrush.a = 0.5;
      const img = document.getElementById("mapimg") as HTMLImageElement;
      img.src = `${DTConstants.config.assetsUrl}/backgrounds/${this.props.account.game.map.data.id}.jpg`;
      ctx.drawImage(img, 0, 0, DTConstants.ORIGINAL_WIDTH, DTConstants.ORIGINAL_HEIGHT, 0, 0, c.width, c.height);
    } else {
      this.walkableCellBrush.a = 1;
      this.losCellBrush.a = 1;
      this.obstacleCellBrush.a = 1;
    }
    for (let i = 0; i < this.cells.Count(); i++) {
      const brush = this.getCellBrush(i);
      if (brush === this.obstacleCellBrush && !this.state.showCellIds) {
        this.cells.ElementAt(i).DrawObstacle(ctx, brush);
      } else {
        this.cells.ElementAt(i).Draw(ctx, brush);
        this.drawPath(ctx);
        // if (this.state.path.includes(i) === true) {
        //   this.cells.ElementAt(i).DrawCross(ctx);
        // }
      }
      if (this.state.showReal && this.props.account.game.map.data.midgroundLayer.containsKey(i)) {
        const gs = this.props.account.game.map.data.midgroundLayer.getValue(i);
        for (const g of gs) {
          if (g.g) {
            const img2 = document.getElementById(`g-${i}-${g.g}`) as HTMLImageElement;
            img2.src = `${DTConstants.config.assetsUrl}/gfx/world/png/${g.g}.png`;
            if (g.sx) {
              // TODO: Turn correctly the image...
            }
            ctx.drawImage(img2, 0, 0, g.cw, g.ch,
              g.x / DTConstants.ORIGINAL_WIDTH * c.width + DTConstants.TILE_WIDTH / 2,
              g.y / DTConstants.ORIGINAL_HEIGHT * c.height + DTConstants.TILE_HEIGHT / 2,
              g.cw / DTConstants.ORIGINAL_WIDTH * c.width,
              g.ch / DTConstants.ORIGINAL_HEIGHT * c.height,
            );
          }
        }
      }
      if (this.state.showCellIds) {
        const cell = this.cells.ElementAt(i);
        ctx.font = "10px tahoma";
        ctx.fillStyle = brush === this.losCellBrush || brush === this.obstacleCellBrush ? "#fff" : "#000";
        ctx.fillText(`${i}`, cell.mid.x - 10, cell.mid.y + 5);
      }
      if (this.props.account.game.map.teleportableCells.includes(i)) {
        this.cells.ElementAt(i).DrawImage(ctx, this.sunImage);
      } else if (this.props.account.game.map.phenixs.find((p) => p.cellId === i) != null) {
        this.cells.ElementAt(i).DrawImage(ctx, this.phenixImage);
      } else if (this.props.account.game.map.lockedStorages.find((ls) => ls.cellId === i) != null) {
        this.cells.ElementAt(i).DrawImage(ctx, this.lockedStorageImage);
      }
      this.drawTileContent(ctx, i);
    }
  }
  private onMouseMove = (event) => {
    const pos = new Point(event.offsetX, event.offsetY);
    const c = this.refs.canvas as HTMLCanvasElement;
    const ctx = c.getContext("2d");
    for (let cellId = 0; cellId < this.cells.Count(); cellId++) {
      const cell = this.cells.ElementAt(cellId);
      if (cell.IsPointInside(pos)) {
        if (this.props.account.isFighting) {
          if (this.props.account.game.fight.playedFighter &&
            this.props.account.game.fight.playedFighter.cellId === cellId) {
            this.showCellInfo(this.props.account.game.fight.playedFighter, cell.mid);
            return;
          } else if (this.props.account.game.fight.allies.find((a) => a.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.fight.allies.find((a) => a.cellId === cellId), cell.mid);
            return;
          } else if (this.props.account.game.fight.enemies.find((e) => e.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.fight.enemies.find((e) => e.cellId === cellId), cell.mid);
            return;
          }
        } else {
          if (this.props.account.game.map.playedCharacter &&
            this.props.account.game.map.playedCharacter.cellId === cellId) {
            this.showCellInfo(this.props.account.game.map.playedCharacter, cell.mid);
            return;
          } else if (this.props.account.game.map.monstersGroups.find((mg) => mg.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.map.monstersGroups.find((mg) => mg.cellId === cellId), cell.mid);
            return;
          } else if (this.props.account.game.map.players.find((p) => p.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.map.players.find((p) => p.cellId === cellId), cell.mid);
            return;
          } else if (this.props.account.game.map.doors.find((d) => d.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.map.doors.find((d) => d.cellId === cellId), cell.mid);
            return;
          } else if (this.props.account.game.map.statedElements.find((se) => se.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.map.statedElements.find((se) => se.cellId === cellId), cell.mid);
            return;
          } else if (this.props.account.game.map.zaap && this.props.account.game.map.zaap.cellId === cellId) {
            this.showCellInfo(this.props.account.game.map.zaap, cell.mid);
            return;
          } else if (this.props.account.game.map.zaapi && this.props.account.game.map.zaapi.cellId === cellId) {
            this.showCellInfo(this.props.account.game.map.zaapi, cell.mid);
            return;
          } else if (this.props.account.game.map.npcs.find((n) => n.cellId === cellId) !== undefined) {
            this.showCellInfo(this.props.account.game.map.npcs.find((n) => n.cellId === cellId), cell.mid);
            return;
          }
        }
      }
    }
    this.hideCellInfo();
  }
  private showCellInfo = async (e: FightPlayerEntry | FighterEntry | PlayerEntry |
                                NpcEntry | MonstersGroupEntry | ElementInCellEntry | StatedElementEntry,
                                point: Point) => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    tooltip.style.borderRadius = "5px";
    tooltip.style.boxShadow = "0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12)";
    tooltip.style.color = "#fff";
    tooltip.style.margin = "5px";
    tooltip.style.padding = "5px";
    tooltip.style.position = "absolute";
    tooltip.style.display = "block";

    let htmlBuffer = "";
    if (e instanceof FightPlayerEntry) {
      htmlBuffer += `${e.name} (${e.level})<br>`;
      htmlBuffer += `${e.lifePercent}%<br>`;
      htmlBuffer += `PA: ${e.actionPoints}, PM: ${e.movementPoints}<br>`;
    } else if (e instanceof FighterEntry) {
      if (e instanceof FightMonsterEntry) {
        htmlBuffer += `<img height="25" width="25" src="${`${DTConstants.config.assetsUrl}/gfx/monsters/${e.creatureGenericId}.png`}">`;
        htmlBuffer += `${e.name}<br>`;
      }
      htmlBuffer += `${e.contextualId}<br>`;
      htmlBuffer += `HP: ${e.lifePercent}%<br>`;
      htmlBuffer += `PA: ${e.actionPoints}<br>`;
      htmlBuffer += `PM: ${e.movementPoints}<br>`;
    } else if (e instanceof PlayerEntry) {
      htmlBuffer += `${e.name} (${e.id})<br>`;
      htmlBuffer += `Level ${e.level}`;
    } else if (e instanceof NpcEntry) {
      htmlBuffer += `${e.name} (${e.id})`;
    } else if (e instanceof MonstersGroupEntry) {
      htmlBuffer += `${e.monstersCount} Monsters (${e.totalLevel})<br>`;
      htmlBuffer += `<img height="25" width="25" src="${e.leader.iconUrl}">`;
      htmlBuffer += `- [${e.leader.genericId}] ${e.leader.name} (${e.leader.level})<br>`;
      for (const m of e.followers) {
        htmlBuffer += `<img height="25" width="25" src="${m.iconUrl}">`;
        htmlBuffer += `- [${m.genericId}] ${m.name} (${m.level})<br>`;
      }
    } else if (e instanceof ElementInCellEntry) {
      htmlBuffer += `Door ${e.element.name ? `: ${e.element.name}` : ""} (${e.cellId})`;
    } else if (e instanceof StatedElementEntry) {
      const interactive = this.props.account.game.map.getInteractiveElement(e.id);
      let resp: Array<IDataResponse<Skills>>;
      let usable: string;
      if (interactive.enabledSkills.length === 0) {
        resp = await DataManager.get<Skills>(DataTypes.Skills, interactive.disabledSkills[0].id);
        usable = "Not Usable";
      } else {
        resp = await DataManager.get<Skills>(DataTypes.Skills, interactive.enabledSkills[0].id);
        usable = "Usable";
      }
      const respItem = await DataManager.get<Items>(DataTypes.Items, resp[0].object.gatheredRessourceItem);
      const obj = respItem[0].object;
      htmlBuffer += `<img height="25" width="25" src="${`${DTConstants.config.assetsUrl}/gfx/items/${obj.iconId}.png`}">`;
      htmlBuffer += ` (${usable}) [${interactive.elementTypeId}] ${interactive.name}`;
    }

    tooltip.innerHTML = htmlBuffer;
    tooltip.style.left = (point.x + 5) + "px";
    tooltip.style.top = (point.y + 5) + "px";
  }

  private hideCellInfo = () => {
    const tooltip = document.getElementById("tooltip");
    tooltip.style.display = "none";
  }

  private onMouseClick = (event) => {
    if (this.props.account.isBusy) {
      return;
    }

    const pos = new Point(event.offsetX, event.offsetY);

    for (let i = 0; i < this.cells.Count(); i++) {
      if (this.cells.ElementAt(i).IsPointInside(pos)) {
        if (this.props.account.game.map.data.cells[i].isWalkable(false)) {
          this.setState({ selectedCellId: i }, () => this.buildMap());

          const task = async () => {
            await sleep(200);
            if (this.state.selectedCellId !== -1) {
              this.setState({ selectedCellId: -1 }, () => this.buildMap());
            }
          };

          task();

          this.handleWalkableCellClicked(i);
        }

        break;
      }
    }
  }

  private handleWalkableCellClicked = (cell: number) => {
    // Check if we can change the map from this cell
    if (this.props.account.game.managers.movements.canChangeMap(cell, MapChangeDirections.Left)) {
      this.props.account.game.managers.movements.changeMapWithCellId(MapChangeDirections.Left, cell);
    } else if (this.props.account.game.managers.movements.canChangeMap(cell, MapChangeDirections.Right)) {
      this.props.account.game.managers.movements.changeMapWithCellId(MapChangeDirections.Right, cell);
    } else if (this.props.account.game.managers.movements.canChangeMap(cell, MapChangeDirections.Top)) {
      this.props.account.game.managers.movements.changeMapWithCellId(MapChangeDirections.Top, cell);
    } else if (this.props.account.game.managers.movements.canChangeMap(cell, MapChangeDirections.Bottom)) {
      this.props.account.game.managers.movements.changeMapWithCellId(MapChangeDirections.Bottom, cell);
    } else {
      // Otherwise just move to the cell
      this.props.account.game.managers.movements.moveToCell(cell);
    }
  }

  private drawPath = (ctx: CanvasRenderingContext2D) => {
    if (this.state.path.length === 0) {
      return;
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#34495e";
    ctx.beginPath();
    const first = this.cells.ElementAt(this.state.path[0]);
    ctx.moveTo(first.mid.x, first.mid.y);

    for (const cell of this.state.path) {
      const p = this.cells.ElementAt(cell);

      ctx.lineTo(p.mid.x, p.mid.y);
    }
    ctx.stroke();
  }
}

export default withStyles(styles)<IProps>(MapViewer);
