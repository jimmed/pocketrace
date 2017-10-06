# PocketRace

> WELCOME
>
> TO
>
> CRAP TESCO

Slack bot and app for managing the unofficial RocketSpace London pool league.

## Components

### Backend Server

 - Express server
 - Sequelize data model
   - Probably PostgreSQL
 - GraphQL API

### Frontend app

Used to handle authentication flow, showing the leaderboard off, and will probably act as an admin tool later on.

### Slack bot + app

Serves sass and helpful information to players. Possibly reminders.

#### Commands

Apart from `/join-pool-league`, all commands require the user to have joined the league, otherwise a message to explain as such is sent to the user.

##### /join-pool-league

Shows the player an interactive panel, with:

 - How long until the next round starts
 - A *Join* button (and cancel)

Once the player has clicked the *Join* button, they are shown another panel, with:

 - Again, how long until the next round starts
 - A list of available commands

##### /leave-pool-league

Shows the player an interactive panel, with:

 - *Leave after this round* button (w/ confirmation(!))
 - *Leave immediately* - forfeits all scheduled matches
 - *Cancel* button

##### /start-pool-match

If the player has no scheduled matches, the bot replies to say as such.

If the player has multiple scheduled matches, they are shown an interactive panel with dropdown from which they can select which match to play.

Otherwise (or once a match has been selected), the player is shown an interactive panel with buttons:

 - *All here, let's go:*
 - *Someone didn't turn up* -> select who didn't turn up

Once pressed, the panel shows three buttons:

 - @firstPlayerName won
 - @secondPlayerName won

Pressing either of these reveals a penultimate panel, with buttons:

 - How many balls did @losingPlayer have left on the table (not including the black)?
 - [0] [1] [2] [3] [4] [5] [6] [7]

Once the number of balls has been pressed, the confirmation panel is shown, with:

 - @winningPlayer ⬆️ 2 positions
 - @losingPlayer ⬇️ 1 positions

##### /pool-leaderboard

Shows both a preformatted table (eugh) showing the current leaderboard. Must find a better way!

##### /current-pool-matches

Shows a list of the next scheduled games for each player.
