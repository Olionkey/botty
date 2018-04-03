#REQUIRED ITEMS
- The most recent version of node.js installed and working
- a working discord account

## REQUIRED INPUTS FOR BOT TO WORK
- must put the account token ./uselessJunkThatMakesTheBotWork/auth.JSON
```JSON
{

  "token": "ACCOUNT-TOKEN-GOES-HERE"

}
```
- in ./uselessJunkThatMakesTheBotWork/toCheck.JSON you must put the user ID, Channel Id, User Name, and Channel Name. The User Id, and User name MUST MATCH UP!!!
    - Below is just an example please do not use this!, it will do you no good.
```JSON
{

    "names":{
      "toCheckUser":
        [
          "167777692735766529"
        ],
      "channelToCheck":
        [
          "419707242540040192"
        ],
      "userNames":
        [
          "Olionkey"
        ],
      "channelNames":
        [
          "general"
        ]
    }

}
```
#HOW TO RUN
- To run the bot open up command prompt and move into the directory of the bot folder, which has index.js in
- next run node . which will start the bot.
