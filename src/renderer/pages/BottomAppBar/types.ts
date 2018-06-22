import { WithStyles } from "@material-ui/core/styles/withStyles";
import { BottomAppBarStyle } from "@renderer/pages/BottomAppBar/styles";

export interface IBottomAppBarProps {
  //
}

export interface IBottomAppBarState {
  totalUsers: number;
  usersConnected: number;
}

export type BottomAppBarProps = IBottomAppBarProps &
  WithStyles<BottomAppBarStyle>;
