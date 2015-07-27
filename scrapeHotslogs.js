//TODO: Add logging for debugging

var fs = require('fs');
var page = require('webpage').create();
var url = "https://www.hotslogs.com/Sitewide/HeroDetails";
var heroes = require("./heroes.js");
console.log(heroes.length);
//var heroes = ["Abathur", "Anub'arak", "Arthas", "Azmodan", "Brightwing", "Chen", "Diablo", "E.T.C.", "Falstad", "Gazlowe", "Illidan", "Jaina", "Johanna", "Kael'thas", "Kerrigan", "Leoric", "Li Li", "Malfurion", "Muradin", "Murky", "Nazeebo", "Nova", "Raynor", "Rehgar", "Sgt. Hammer", "Sonya", "Stitches", "Sylvanas", "Tassadar", "The Butcher", "The Lost Vikings", "Thrall", "Tychus", "Tyrael", "Tyrande", "Uther", "Valla", "Zagara", "Zeratul"];
var scrapeCount = 0;
var maxScrape =  heroes.length;
var details = {};
var formData = {};
var buildPath = "./public/builds/";

getFormData(function(){
    scrapeBuilds(0);
})

function scrapeBuilds(index){
    var hero = heroes[index];
    if(index < maxScrape){
        console.log("scraping data for ", hero);
        formData["ctl00$MainContent$DropDownHero"] = hero;
        var settings = {
            operation: "POST",
            data: encodeFormData(formData)
        };
        page.open(url+"?Hero="+encodeURIComponent(hero), settings, function(status) {
            var builds = page.evaluate(getBuilds);
            console.log(builds);
            details[hero] = builds;
            fs.write(buildPath+formatHeroName(hero)+".json", JSON.stringify(builds, null, 4), "w");
            scrapeBuilds(++index);
        });
    } else{
        fs.write(buildPath+"details.json", JSON.stringify(details,null,4), "w");
        phantom.exit();
    }
}

function formatHeroName(name){
    return name.toLowerCase().replace(/ /g,"").replace(/'/g,"").replace(/\./g,"")
}

function encodeFormData(data){
    var result = "";
    for(var prop in data){
        result += (prop+"="+encodeURIComponent(data[prop])+"&");
    }
    return result.slice(0,-1);
}

function getFormData(callback){
    page.open(url,function(status){
        formData = page.evaluate(function(){
            var data = {
                "ctl00$TextBoxPlayerSearch":"",
                "ctl00$MainContent$DropDownHero":"Abathur",
                "ctl00$MainContent$DropDownLeague":"0",
                "ctl00$MainContent$DropDownMapName":"-1",
                "ctl00$MainContent$DropDownReplayDateTime":"Current",
                "ctl00_MainContent_RadGridHeroTalentStatistics_ClientState":"",
                "ctl00_MainContent_RadGridPopularTalentBuilds_ClientState":"",
                "RadGridSitewideCharacterWinPercentVsOtherCharacters_ClientState":"",
                "ctl00$DropDownLanguage":"en",
                "ctl00$DropDownThemeNavbar":"",
                "ctl00$DropDownThemeColor":"style-blue",
                "__EVENTTARGET" : "ctl00$MainContent$DropDownLeagueA",
                "__EVENTARGUMENT" : "",
                "__LASTFOCUS" : ""
            };
            
            data.ctl10_TSM = theForm.querySelector("#ctl10_TSM").value;
            data.__VIEWSTATE = theForm.querySelector("#__VIEWSTATE").value;
            data.__VIEWSTATEGENERATOR = theForm.querySelector("#__VIEWSTATEGENERATOR").value;
            data.__EVENTVALIDATION = theForm.querySelector("#__EVENTVALIDATION").value;

            return data;
        });
        callback();
    });
}

function getBuilds(){
    rows = document.querySelectorAll(
            "#ctl00_MainContent_RadGridPopularTalentBuilds_ctl00 > tbody > tr");
    lvlArr = [false,false,1,4,7,10,13,16,20];
    builds = [];

    for(var idx = 0; idx < rows.length; idx++){
        var dataArr = rows[idx].querySelectorAll("td");
        var build = {};

        build.gamesPlayed = dataArr[0].textContent;
        build.winPercent = dataArr[1].textContent;
        build.talents = [];
        for(var i = 2; i < 9; i++){
            var item = dataArr[i].querySelector("img");
            var choice = {};
            choice.img = item.getAttribute("src");
            choice.name = item.getAttribute("title").split(":")[0];
            choice.desc = item.getAttribute("title").split(":").slice(1).join(":").trim();
            choice.lvl = lvlArr[i];
            build.talents.push(choice);
        }

        builds.push(build);
    }
    return builds;
}
