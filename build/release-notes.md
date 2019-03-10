# CookieTouch

## FR

- La méthode `quests.isOngoing` est renommée `quests.isActive`
- Correction de la méthode `quests.currentStep`
- Il est désormais possible d'utiliser les objets interactifs via l'onglet Map
- Ajout d'un bouton `Quitter Dialogue` afin de quitter les dialogues plus rapidement/manuellement en cas de bug
- Il est désormais possible d'ajouter le serveur ainsi que le nom du personnage dans le fichier txt d'import de comptes
- Ajout de la méthode `useEmote(ID)` dans les scripts. Ex: Pour s'assoir `useEmote(1);`
- Ajout des modes marchants dans les scripts (merchants.open(cellId), merchants.objectsInShop(), merchants.buy(gid, qty))
- Les modes marchants sont également disponible dans l'onglet map!

## EN

- `quests.isOngoing` is renamed `quests.isActive`
- Fix `quests.currentStep`
- We can now use interactive elements on the map viewer
- Add a `Leave Dialog` button to leave dialog quicker/manually after a bug
- We can now add server and character's name in the te txt to import accounts
- Add `useEmote(ID)` in scripts. Ex: to sit `useEmote(1);`
- Add merchants in scripts! (merchants.open(cellId), merchants.objectsInShop(), merchants.buy(gid, qty))
- Merchants are now available in the map viewer!
