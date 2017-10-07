# PocketRace

> WELCOME
>
> TO
>
> CRAP TESCO

Slack bot and app for managing the unofficial RocketSpace London pool league.

## Data Model



### User State

Modelled as a finite state machine, [like so](https://mermaidjs.github.io/mermaid-live-editor/#/view/Z3JhcGggVEQKClN0YXJ0W1VzZXIgbm90IHNpZ25lZCB1cF0gLS0-fFVzZXIgam9pbnN8IEF3YWl0aW5nUm91bmRTdGFydFtVc2VyIGF3YWl0aW5nIHJvdW5kIHN0YXJ0XQpBd2FpdGluZ1JvdW5kU3RhcnQgLS0-fFVzZXIgbGVhdmVzfCBTdGFydApBd2FpdGluZ1JvdW5kU3RhcnQgLS0-fFJvdW5kIHN0YXJ0c3wgTWF0Y2hlc1NjaGVkdWxlZFtVc2VyIGhhcyBtYXRjaGVzIHNjaGVkdWxlZF0KTWF0Y2hlc1NjaGVkdWxlZCAtLT58Um91bmQgZW5kc3wgTWF0Y2hlc1NjaGVkdWxlZApNYXRjaGVzU2NoZWR1bGVkIC0tPnxVc2VyIHN0YXJ0cyBtYXRjaHwgUGxheWluZ0dhbWVbVXNlciBpcyBwbGF5aW5nIGEgbWF0Y2hdCk1hdGNoZXNTY2hlZHVsZWQgLS0-fFVzZXIgbGVhdmVzfCBTdGFydApQbGF5aW5nR2FtZSAtLT58TWF0Y2ggcmVzdWx0IHJlcG9ydGVkfCBNYXRjaGVzU2NoZWR1bGVk)

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

[View interaction flowchart](https://mermaidjs.github.io/mermaid-live-editor/#/view/Z3JhcGggVEQKClN0YXJ0IC0tPnwvam9pbi1wb29sLWxlYWd1ZXwgSm9pbkpvaW5lZENoZWNre0hhcyBqb2luZWQ_fQpKb2luSm9pbmVkQ2hlY2sgLS0-fFllc3wgSm9pbkFscmVhZHlKb2luZWQoTWVzc2FnZTogWW91IGhhdmUgYWxyZWFkeSBqb2luZWQpCkpvaW5Kb2luZWRDaGVjayAtLT58Tm98IEpvaW5Qcm9tcHRbUHJvbXB0OiBKb2luP10KSm9pblByb21wdCAtLT58Sm9pbiBQb29sIExlYWd1ZXwgSm9pbmVkCkpvaW5Qcm9tcHQgLS0-fENhbmNlbHwgQ2FuY2VsbGVkCg)

##### /leave-pool-league

Shows the player an interactive panel, with:

 - *Leave after this round* button (w/ confirmation(!))
 - *Cancel* button

[View interaction flowchart](https://mermaidjs.github.io/mermaid-live-editor/#/view/Z3JhcGggVEQKClN0YXJ0IC0tPnwvbGVhdmUtcG9vbC1sZWFndWV8IEpvaW5lZENoZWNre0hhcyBqb2luZWQ_fQpKb2luZWRDaGVjayAtLT58Tm98IEFscmVhZHlKb2luZWQoTWVzc2FnZTogWW91IGhhdmUgbm90IGpvaW5lZC4pCkpvaW5lZENoZWNrIC0tPnxOb3wgUHJvbXB0W1Byb21wdDogTGVhdmU_XQpQcm9tcHQgLS0-fExlYXZlfCBNYXJrTGVmdFtNYXJrIHBsYXllciBhcyBsZWZ0XQpQcm9tcHQgLS0-fENhbmNlbHwgQ2FuY2VsbGVkCg)

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

[View interaction flowchart](https://mermaidjs.github.io/mermaid-live-editor/#/view/Z3JhcGggVEQKClN0YXJ0IC0tPnwvc3RhcnQtcG9vbC1tYXRjaHwgSm9pbmVkQ2hlY2t7SGFzIGpvaW5lZD99CkpvaW5lZENoZWNrIC0tPnxOb3wgQWxyZWFkeUpvaW5lZChNZXNzYWdlOiBZb3UgaGF2ZSBub3Qgam9pbmVkLikKSm9pbmVkQ2hlY2sgLS0-fFllc3wgR2FtZUNoZWNre0hhcyBzY2hlZHVsZWQgbWF0Y2g_fQpHYW1lQ2hlY2sgLS0-fE5vbmV8IE5vR2FtZXMoTWVzc2FnZTogWW91IGhhdmUgbm8gc2NoZWR1bGVkIG1hdGNoZXMpCkdhbWVDaGVjayAtLT58T25lfCBSZWFkeVRvU3RhcnR7U3RhcnQgbWF0Y2g_fQpHYW1lQ2hlY2sgLS0-fFR3byBvciBtb3JlfCBHYW1lUGlja2Vye1BpY2sgbWF0Y2ggZnJvbSBkcm9wZG93bn0KR2FtZVBpY2tlciAtLT58U2VsZWN0IGdhbWV8IFJlYWR5VG9TdGFydApSZWFkeVRvU3RhcnQgLS0-fFN0YXJ0IGdhbWV8IE91dGNvbWVTZWxlY3RvcntTZWxlY3Qgb3V0Y29tZX0KUmVhZHlUb1N0YXJ0IC0tPnxPcHBvbmVudCBkaWRuJ3QgdHVybiB1cHwgRG9uZQpPdXRjb21lU2VsZWN0b3IgLS0-fEkgd29ufCBCYWxsQ291bnR7SG93IG1hbnkgYmFsbHMgbGVmdD99Ck91dGNvbWVTZWxlY3RvciAtLT58JG9wcG9uZW50IHdvbnwgQmFsbENvdW50Ck91dGNvbWVTZWxlY3RvciAtLT58V2UgZHJldywgc29tZWhvd3wgRG9uZQpCYWxsQ291bnQgLS0-IERvbmVbUmVzdWx0IHJlcG9ydGVkXQ)

##### /pool-leaderboard

Shows both a preformatted table (eugh) showing the current leaderboard. Must find a better way!

##### /current-pool-matches

Shows a list of the next scheduled games for each player.
