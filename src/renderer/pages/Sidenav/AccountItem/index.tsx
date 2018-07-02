import Account from "@/account";
import { AccountStates } from "@/account/AccountStates";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import withStyles from "@material-ui/core/styles/withStyles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CookieMain from "@renderer/CookieMain";
import { accountItemStyles } from "@renderer/pages/Sidenav/AccountItem/styles";
import {
  AccountItemProps,
  IAccountItemProps,
  IAccountItemState
} from "@renderer/pages/Sidenav/AccountItem/types";
import * as React from "react";

class AccountItem extends React.Component<AccountItemProps, IAccountItemState> {
  public render() {
    const { account, classes } = this.props;

    return (
      <div className={classes.root}>
        <ListItem
          button={true}
          onClick={this.changeAccount(account)}
          style={{
            backgroundColor:
              CookieMain.selectedAccount.accountConfig.username ===
                account.accountConfig.username && "rgba(180, 180, 180, 0.2)"
          }}
        >
          <ListItemIcon>
            {account.state === AccountStates.NONE ? (
              <Avatar
                src={account.game.character.getSkinUrl("face", 1, 120, 120, 1)}
              />
            ) : (
              <AccountCircle className={classes.image} />
            )}
          </ListItemIcon>
          <ListItemText
            inset={true}
            primary={
              <span className={classes.text}>
                {account.accountConfig.username}
              </span>
            }
          />
        </ListItem>
      </div>
    );
  }

  private changeAccount = (account: Account) => (
    event: React.MouseEvent<HTMLElement>
  ) => {
    CookieMain.selectedAccount = account;
  };
}

export default withStyles(accountItemStyles)<IAccountItemProps>(AccountItem);
