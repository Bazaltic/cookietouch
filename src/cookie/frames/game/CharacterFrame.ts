import Account from "@/account";
import LanguageManager from "@/configurations/language/LanguageManager";
import LifePointsRegenEndMessage from "@/protocol/network/messages/LifePointsRegenEndMessage";

export default class CharacterFrame {
  private account: Account;

  constructor(account: Account) {
    this.account = account;
    this.register();
  }

  private register() {
    this.account.dispatcher.register(
      "EmotePlayMessage",
      this.HandleEmotePlayMessage,
      this
    );
    this.account.dispatcher.register(
      "CharacterExperienceGainMessage",
      this.HandleCharacterExperienceGainMessage,
      this
    );
    this.account.dispatcher.register(
      "CharacterStatsListMessage",
      this.HandleCharacterStatsListMessage,
      this
    );
    this.account.dispatcher.register(
      "CharacterLevelUpMessage",
      this.HandleCharacterLevelUpMessage,
      this
    );
    this.account.dispatcher.register(
      "UpdateLifePointsMessage",
      this.HandleUpdateLifePointsMessage,
      this
    );
    this.account.dispatcher.register(
      "GameRolePlayPlayerLifeStatusMessage",
      this.HandleGameRolePlayPlayerLifeStatusMessage,
      this
    );
    this.account.dispatcher.register(
      "PlayerStatusUpdateMessage",
      this.HandlePlayerStatusUpdateMessage,
      this
    );
    this.account.dispatcher.register(
      "LifePointsRegenBeginMessage",
      this.HandleLifePointsRegenBeginMessage,
      this
    );
    this.account.dispatcher.register(
      "LifePointsRegenEndMessage",
      this.HandleLifePointsRegenEndMessage,
      this
    );
    this.account.dispatcher.register(
      "SpellListMessage",
      this.HandleSpellListMessage,
      this
    );
    this.account.dispatcher.register(
      "SpellUpgradeSuccessMessage",
      this.HandleSpellUpgradeSuccessMessage,
      this
    );
    this.account.dispatcher.register(
      "JobDescriptionMessage",
      this.HandleJobDescriptionMessage,
      this
    );
    this.account.dispatcher.register(
      "JobExperienceMultiUpdateMessage",
      this.HandleJobExperienceMultiUpdateMessage,
      this
    );
    this.account.dispatcher.register(
      "JobExperienceUpdateMessage",
      this.HandleJobExperienceUpdateMessage,
      this
    );
    this.account.dispatcher.register(
      "MountXpRatioMessage",
      this.HandleMountXpRatioMessage,
      this
    );
    this.account.dispatcher.register(
      "MountRidingMessage",
      this.HandleMountRidingMessage,
      this
    );
    this.account.dispatcher.register(
      "MountSetMessage",
      this.HandleMountSetMessage,
      this
    );
  }

  private async HandleEmotePlayMessage(account: Account, message: any) {
    account.game.character.UpdateEmotePlayMessage(message);
  }

  private async HandleCharacterExperienceGainMessage(
    account: Account,
    message: any
  ) {
    account.statistics.UpdateCharacterExperienceGainMessage(message);
    account.game.character.stats.UpdateCharacterExperienceGainMessage(message);
    this.account.logger.logDebug(
      LanguageManager.trans("characterFrame"),
      LanguageManager.trans("experienceGain", message.experienceCharacter)
    );
  }

  private async HandleCharacterStatsListMessage(
    account: Account,
    message: any
  ) {
    account.game.character.UpdateCharacterStatsListMessage(message);
  }

  private async HandleCharacterLevelUpMessage(account: Account, message: any) {
    account.statistics.UpdateCharacterLevelUpMessage(message);
    account.game.character.UpdateCharacterLevelUpMessage(message);
    this.account.logger.logDebug(
      LanguageManager.trans("characterFrame"),
      LanguageManager.trans("levelUp")
    );
  }

  private async HandleUpdateLifePointsMessage(account: Account, message: any) {
    account.game.character.stats.UpdateUpdateLifePointsMessage(message);
  }

  private async HandleGameRolePlayPlayerLifeStatusMessage(
    account: Account,
    message: any
  ) {
    account.game.character.UpdateGameRolePlayPlayerLifeStatusMessage(message);
  }

  private async HandlePlayerStatusUpdateMessage(
    account: Account,
    message: any
  ) {
    account.game.character.UpdatePlayerStatusUpdateMessage(message);
  }

  private async HandleLifePointsRegenBeginMessage(
    account: Account,
    message: any
  ) {
    account.game.character.UpdateLifePointsRegenBeginMessage(message);
  }

  private async HandleLifePointsRegenEndMessage(
    account: Account,
    message: LifePointsRegenEndMessage
  ) {
    account.game.character.UpdateLifePointsRegenEndMessage(message);

    if (message.lifePointsGained > 0) {
      this.account.logger.logDebug(
        LanguageManager.trans("characterFrame"),
        LanguageManager.trans("lifePointsGained", message.lifePointsGained)
      );
    }

    account.game.character.stats.UpdateLifePointsRegenEndMessage(message);
  }

  private async HandleSpellListMessage(account: Account, message: any) {
    account.game.character.UpdateSpellListMessage(message);
  }

  private async HandleSpellUpgradeSuccessMessage(
    account: Account,
    message: any
  ) {
    account.game.character.UpdateSpellUpgradeSuccessMessage(message);
  }

  private async HandleJobDescriptionMessage(account: Account, message: any) {
    account.game.character.jobs.UpdateJobDescriptionMessage(message);
  }

  private async HandleJobExperienceMultiUpdateMessage(
    account: Account,
    message: any
  ) {
    await account.game.character.jobs.UpdateJobExperienceMultiUpdateMessage(
      message
    );
  }

  private async HandleJobExperienceUpdateMessage(
    account: Account,
    message: any
  ) {
    await account.game.character.jobs.UpdateJobExperienceUpdateMessage(message);
  }

  private async HandleMountXpRatioMessage(account: Account, message: any) {
    await account.game.character.mount.UpdateMountXpRatioMessage(message);
  }

  private async HandleMountRidingMessage(account: Account, message: any) {
    await account.game.character.mount.UpdateMountRidingMessage(message);
  }

  private async HandleMountSetMessage(account: Account, message: any) {
    await account.game.character.mount.UpdateMountSetMessage(message);
  }
}
