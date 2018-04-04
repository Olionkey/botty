/* Make 2 processes: one for regenerating (the master) and one to do the processing (the worker) */
var cluster = require('cluster');
/* Check to see if the process is the master */
if (cluster.isMaster) {
  /* Fork workers. In the future, the plan is to have the bot be multi-threaded */
  for (var i = 0; i < (1); i++) {
    cluster.fork();
  }

  console.log("Master PID is " + process.pid)

  cluster.on('exit', function(deadWorker, code, signal) {
    /* Restart the worker */
    var worker = cluster.fork();

    /* Note the process IDs */
    var newPID = worker.process.pid;
    var oldPID = deadWorker.process.pid;

    /* Log the event */
    console.log('worker '+oldPID+' died.');
    console.log('worker '+newPID+' born.');
  });

} else {
  /* This is the PID of the new generated process. It doesn't show the 'worker PID born' at startup */
  console.log("Spawned with PID " + process.pid)

  /* Required Files */
  const auth           = require("./uselessJunkThatMakesTheBotWork/auth.json");
  const config         = require("./uselessJunkThatMakesTheBotWork/config.json").general;
  const Discord        = require("discord.js");
  const client         = new Discord.Client();

  var fs               = require('fs'),
  usersToCheck         = require('./uselessJunkThatMakesTheBotWork/toCheck.json').names;

  /*Start bot */
  client.login(auth.token)
  client.on("ready" , () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    const member = client.channels.get(config.statusChannelID);
  });

  /* When the bot is first added to a new server */
  client.on("guildCreate", guild => {
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  });

  /*When the bot is deleted from a server */
  client.on("guildDelete", guild => {
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  });

  /* Will run when it sees a message */
  client.on("message", async message =>{
    /* Will ignore it self */
    if(message.author.bot) return;
    if(message.content !== "+r"){
      theFuckBoisCommand(message);
    }

    //Will search for the prefix for the bot to function
    if(message.content.indexOf(config.prefix) !== 0) return;

    /* Will split up the message after every space */
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    switch(command){
      /*Will only run when you want the bot to reload through discord, and not have to restart the command prompt */
      case 'r':
      console.log("Reload time!");
      process.exit(0);
      break;

      default:
      break;
    }
  });
}

function theFuckBoisCommand(message){
  var channelcheck = usersToCheck.channelToCheck;
  var nameCheck    = usersToCheck.toCheckUser;
  //First loop will go through the channels first, because most of the time it will be less things to Check
  //Second loop will go through the users to check, which also checks if they have said something with in that channel that you wish for them to belong in.
  for(var i = 0 ; i < channelcheck.length; i ++){
    for(var j = 0 ; j < nameCheck.length; j ++){
      //Checks to see if they are one of the lucky few
      if( message.author.id === nameCheck[j] && message.channel.id === channelcheck[i]){
        let d = new Date();
        let time = d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds()+":\n\t\t\t"; // This is what creates the time to keep track of it in the output.txt
        /*Statement to check if the message includeds a codeblock, if so it will return it */
        if(message.content.includes("```")){
          fs.appendFile("./uselessJunkThatMakesTheBotWork/output.txt", (time + usersToCheck.userNames[j]+":\t"+ message.content+"\n\r"), function (err){
            if(err) throw err;
          });
        }
        /* Statement to check if the message has any attachments, this is the statement that will be run more often then not. */
        else if (message.attachments.size === 0){
          fs.appendFile("./uselessJunkThatMakesTheBotWork/output.txt", (time + usersToCheck.userNames[j]+":\t" +message.content+"\n"), function (err){
            if(err) throw err;
          });
        }
        /* This will run when there is one or more attachments part of the message */
        else{
          fs.appendFile("./uselessJunkThatMakesTheBotWork/output.txt", (time + usersToCheck.userNames[j]+":\t"+ message.attachments.first().url+"\n\r"), function(err){
            if(err) throw err;
          });
        }
        console.log("I have been triggerd by: " + usersToCheck.userNames[j] + "\n\tAt: " + time);
      }
    }
  }
  /* Just to reload the bot to keep it alive. Will reload every 30 minutes, unless there is a message sent then the timer is reset*/
  function reload(){console.log("I can reload my self you know?");process.exit(0);}
      setTimeout(function(){
          reload();
      },(21600000/12)); //Done in milliseconds, this is about 30 mins.
}
