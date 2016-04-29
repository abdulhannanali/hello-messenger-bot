const Bot = require("messenger-bot")
const http = require("http")
const fs = require("fs")
const request = require("request")

require("./config")

var ENV = process.env
var PORT = process.env.PORT || 4000
var HOST = process.env.HOST || "0.0.0.0"

var message_obj = []

var token = ENV["TOKEN"]

var lambos = JSON.parse(fs.readFileSync("./images.json"))

var bot = new Bot({
    token: ENV["TOKEN"],
    verify: ENV["VERIFY"],
    app_secret: ENV["SECRET"]
}) 

bot.on("error", function (error) {
    console.error(error)
})

bot.on("message", function (payload, reply) {
    bot.sendMessage(payload.sender.id, {
        
    })

    bot.sendMessage(payload.recipient.id, {
        attachment: {
            type: "template",
            payload: {
                template_type: "button",
                text: "some text",
                buttons: [
                    {
                    type: "postback",
                    title: "this is a title",
                    payload: "ROLLING"
                    }
                ]
            }
        }
    }, console.log)
})

bot.on('delivery', function (payload) {
    payload.delivery.mids.forEach(function (message_id) {
        message_obj[message_id] = true
    })
    
    console.log(message_obj)
})

bot.on("postback", function (payload, reply) {
    console.log(payload)
})

function giveLambos (sender) {
    var PRIMARY_URL = "https://i.imgur.com/*.jpg"
    
    var elements = lambos.map(function (lambo, index, array) {
        var url = PRIMARY_URL.replace("*", lambo)
        return {
            title: `Lambo ${index + 1}`,
            item_url: url,
            image_url: url,
            buttons: [
                {
                    type: "web_url",
                    title:  "Open in Web!",
                    url: url
                },
                {
                    type: "postback",
                    title: "Get Image",
                    payload: "GET_IMAGE_" + lambo
                }
            ]
        }
    })
    
    console.log(elements)
    
    bot.sendMessage(sender, {
        attachment: {
            type: "template",
            payload: {
                template_type: "generic",
                elements: elements   
            }
        }
    })
}

http.createServer(bot.middleware()).listen(PORT, function (error) {
    if (error) {
        console.error(error)
    }
    else {
        console.log("Server is listening on PORT = " + PORT)
        console.log("HOST: " + HOST)
    }
})
