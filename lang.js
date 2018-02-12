module.exports = class Lang {
  constructor(lang) {
    switch(lang) {
      case 'SV' :
        this.dict = {
          tokens_file_not_found : "tokejs.json hittades inte, skapar...",
          token_info : "Ändra discord token och wolfram app id med mera i tokens.json",
          vote_prison_start1 : "Röstning startades för ",
          vote_prison_start2 : "\nRöstningen avbryts automatiskt om ",
          vote_prison_start3 : " sekunder.\n",
          vote_prison_start4 : " röst(er) krävs.",

          ready_message : "Kiwi är redo!",

          help_info_title : "Hjälpinfo för Kiwi",
          help_info : "Kommandon:\n\n"+
                        "**!help-kiwi**   Visar den här sidan.\n"+
                        "**!solve <equation>**   Hittar steg för steg lösningar via wolframalpha.com.\n"+
                        "**!render-line <text>**   Skapar text med linjer.\n"+
                        "**!render <text>**   Rendera text uppbyggda av symboler.\n"+
                        "**!sym <textSymbol> <backgroundSymbol>**   Ställ in de symboler som ska användas när text ritas med !render.\n"+
                        "**!user-info <name>**   Hämta information från servern om en person.\n"+
                        "**!notify <YYYY-MM-DD> <HH:MM> <text>**   Skapa notis som skickas i general-chatten vid tidpunkten.\n"+
                        "**!notify <HH:MM> <text>**   Skapa notis som skickas i general-chatten vid tidpunkten.\n"+
                        "**!notify-list**   Visar en lista på de notiser som väntar.\n"+
                        "**!notify-remove <index>**   Tar bort en notis.\n"+
                        "**!imprison <name>**   Fängsla en person på servern.\n"+
                        "**!pardon <name>**   Ta bort en person från fängelset.\n",

          vote_prison_expire : "Fängelseröstningen avbröts för ",
          vote_prison1 : "Du röstade för ",
          vote_prison2 : " röst(er) till krävs.",
          vote_prison3 : "Du har redan röstat! ",

          vote_prison4 : " har skickats till fängelset!",
          vote_prison5 : " har släppts från fängelset!",

          user_not_found : "Användaren kan inte hittas!",

          notify_no_callback : "Ingen callback specificerad, notisen visas här:",
          notify_header : "index : datum och tid : meddelande\n",
          notify_overflow : "Det finns för många notiser, ta bort notiser med !notify-remove <index>\nFå upp en lista på alla aktiva notiser med !notify-list",
          notify_time_or_date_input_error : "Något verkar vara fel med datumet eller tiden?",
          notify_set : "Notis sparad: ",
          notify_json_not_found : "notifications.json hittades inte, skapar...",
          notify_json_found : "notifications.json laddades in!",
          notify_notification_title : "Notis",
          notify_index_not_found : "Index hittades inte!\nSkriv !notify-list för en lista med alla notiser!",
          notify_remove_syntax_error : "Skriv !notify-remove <index>",

          render_max_6_chars : "Max 6 karaktärer!",

          user_info_not_registered : "ej registrerad",

          wolfram_thinking : "En fundering pågår... :thinking:",
          wolfram_solution_found1 : " lösning hittades... :bulb:",
          wolfram_solution_found2 : " lösningar hittades... :bulb:",
          wolfram_for : " för:",
          wolfram_no_step_by_step : "Inga steg för steg lösningar hittades. Gå in på länken för mer info:\n",
        }
        break;
      case 'EN' :
        this.dict = {
          tokens_file_not_found : "tokejs.json hittades inte, skapar...",
          token_info : "Edit discord token and wolfram app id and more in tokens.json",
          vote_prison_start1 : "Vote started for ",
          vote_prison_start2 : "\nAuto cancel in ",
          vote_prison_start3 : " seconds.\n",
          vote_prison_start4 : " vote(s) needed.",

          ready_message : "Kiwi is ready!",

          help_info_title : "Help info for Kiwi",
          help_info : "Commands:\n\n"+
                        "**!help-kiwi**   Shows this page.\n"+
                        "**!solve <equation>**   Finds step by step solutions using wolframalpha.com.\n"+
                        "**!render-line <text>**   Creates text with lines.\n"+
                        "**!render <text>**   Render text with symbols.\n"+
                        "**!sym <textSymbol> <backgroundSymbol>**   Set the symbols used by !render.\n"+
                        "**!user-info <name>**   Fetch info about a person from the server.\n"+
                        "**!notify <YYYY-MM-DD> <HH:MM> <text>**   Create a notification that gets displayed in general at the specified time.\n"+
                        "**!notify <HH:MM> <text>**   Create a notification that gets displayed in general at the specified time.\n"+
                        "**!notify-list**   Display a list of all awaiting notifications.\n"+
                        "**!notify-remove <index>**   Removes a notification.\n"+
                        "**!imprison <name>**   Imprison a person on the server.\n"+
                        "**!pardon <name>**   Pardon a person on the server.\n",

          vote_prison_expire : "Voting for prison expired for user ",
          vote_prison1 : "You voted for ",
          vote_prison2 : " more vote(s) needed.",
          vote_prison3 : "You have already voted! ",

          vote_prison4 : " have been sent to prison!",
          vote_prison5 : " have been released from prison!",

          user_not_found : "This user cannot be found!",

          notify_no_callback : "No callback specified, notification will display here:",
          notify_header : "index : date and time : message\n",
          notify_overflow : "Too many notifications, remove notifications by !notify-remove <index>\nGet a list of all notifications by typing !notify-list",
          notify_time_or_date_input_error : "Someting wrong with time or date input?",
          notify_set : "Notification set: ",
          notify_json_not_found : "notifications.json not found, creating...",
          notify_json_found : "Load of notifications.json successful!",
          notify_notification_title : "Notification",
          notify_index_not_found : "Index not found!\nType !notify-list to get a list of all entries!",
          notify_remove_syntax_error : "Type !notify-remove <index>",

          render_max_6_chars : "Maximum 6 Characters!",

          user_info_not_registered : "not registered",

          wolfram_thinking : "Processing data... :thinking:",
          wolfram_solution_found1 : " solution found... :bulb:",
          wolfram_solution_found2 : " solutions found... :bulb:",
          wolfram_for : " for:",
          wolfram_no_step_by_step : "No step by step solutions found. Click the link below to get more info:\n",
        }
        break;
    }
  }
}
