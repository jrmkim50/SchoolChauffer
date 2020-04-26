function displayTime() {
    var time = document.getElementById("time");
    window.onload = function () {
        time.innerHTML = Date();
    }
    setInterval(function () { time.innerHTML = Date(); }, 1000);
}

displayTime()

class ScheduleItem {
    constructor(name, startTime, endTime, link) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.link = link;
    }

    addToTable() {
        var body = document.getElementsByTagName("body")[0];
        var tbl = document.getElementById("schedule");
        var tblBody = document.getElementById("schedule body");
        var row = document.createElement("tr");

        for (var columnNum = 0; columnNum < 5; columnNum++) {
            var cell = document.createElement("td");
            var cellText;
            switch (columnNum) {
                case 0:
                    cell.addEventListener("keyup", function () {
                        save(tbl, "scheduleTable");
                    })
                    cellText = document.createTextNode(this.name);
                    break;
                case 1:
                    cell.addEventListener("keyup", function () {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    cellText = document.createTextNode(this.startTime);
                    break;
                case 2:
                    cellText = document.createTextNode(this.endTime);
                    cell.addEventListener("keyup", function () {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    break;
                case 3:
                    cell.addEventListener("keyup", function () {
                        save(tbl, "scheduleTable");
                    })
                    cellText = document.createTextNode(this.link);
                    break;
                case 4:
                    cellText = document.createElement("button")
                    cellText.onclick = function () {
                        tblBody.removeChild(this.parentNode.parentNode);
                        localStorage.setItem("scheduleTable", tbl.innerHTML);
                    }
                    break;
                default:
                    break;
            }
            cell.appendChild(cellText);

            if (columnNum == 4) {
                cell.contentEditable = false;
                cell.setAttribute("contenteditable", false);
            } else {
                cell.contentEditable = true;
                cell.setAttribute("contenteditable", true);
            }
            row.appendChild(cell);
        }
        tblBody.appendChild(row);
        tbl.appendChild(tblBody);
        body.appendChild(tbl);
    }
}

function setupTable() {
    var tbl = document.getElementById("schedule");
    var tblBody = document.getElementById("schedule body");
    var rows = document.getElementsByTagName("tr");
    for (var i = 0; i < rows.length; i++) {
        var columns = rows[i].getElementsByTagName("td");
        for (var j = 0; j < columns.length; j++) {
            var cell = columns[j];
            switch (j) {
                case 1:
                    cell.addEventListener("keyup", function () {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    break;
                case 2:
                    cell.addEventListener("keyup", function () {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    break;
                case 4:
                    var deleteButton = cell.getElementsByTagName("button")[0];
                    cell.addEventListener("click", function () {
                        var row = this.parentNode
                        row.parentNode.removeChild(row);
                        save(tbl, "scheduleTable");
                    });
                default:
                    cell.addEventListener("keyup", function () {
                        save(tbl, "scheduleTable");
                    })
                    break;
            }
        }
    }
}


function myFunction() {
    document.getElementById("time").style.backgroundColor = "red";
}

function checkInput(object) {
    var text = object.textContent;
    var regex = /([1-9]|1[012])[:]([0-5][0-9]) [A|P][M]/;
    var match = text.match(regex);
    return match && text === match[0];
}

function newRow() {
    var tbl = document.getElementById("schedule");
    var add = document.getElementById("add");
    add.onclick = function () {
        var scheduleItem = new ScheduleItem("", "", "", "")
        scheduleItem.addToTable()
        localStorage.setItem("scheduleTable", tbl.innerHTML);
    }
}

function load(id, key) {
    var object = document.getElementById(id);
    var saved = localStorage.getItem(key);
    if (saved) {
        object.innerHTML = saved;
    }
}

function save(object, key) {
    localStorage.setItem(key, object.innerHTML);
}

function clear() {
    localStorage.clear();
}

var table = document.getElementById('schedule');
var classIndex = 0;

function setDateTime(date, time) {
    var index = time.indexOf(":"); // replace with ":" for differently displayed time.
    var index2 = time.indexOf(" ");

    var hours = parseInt(time.substring(0, index));
    var minutes = parseInt(time.substring(index + 1, index2));

    var mer = time.substring(index2 + 1, time.length);
    if (mer == "PM" && hours != 12) {
        hours = hours + 12;
    }
    if (mer == "AM" && hours == 12) {
        hours = hours - 12;
    }


    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds("00");

    return date;
}

// 
function sendNotification(title, message, link) {
    var opt = {
        iconUrl: "images/logo.png",
        type: 'basic',
        title: title,
        message: message,
        priority: 1,
    };

    // clears all prexisting notifications
    chrome.notifications.getAll(function (notifications) {
        for (const notifID in notifications) { chrome.notifications.clear(notifID) }
    });

    chrome.notifications.create(title, opt, function () { console.log('created!'); });
    chrome.notifications.onClicked.addListener(function (notifId) {
        chrome.notifications.clear(notifId);
        console.log("BUTTON CLİCKED");
        window.open(link);
    });
}

function getEvents() {
    var events = {}

    var rows = document.getElementsByTagName("tr");
    for (i = 2; i < rows.length; i++) {
        var columns = rows[i].getElementsByTagName("td");
        var name = columns[0].textContent;
        events[name] = new ScheduleItem(name, columns[1].textContent, "0", columns[3].textContent);
    }

    return events;
}

function main() {
    var timer = new interval(5000, function () {
        iterate();
    })
    timer.run()
}

function iterate() {
    var events = getEvents();

    // TODO: stop alarms repreating over and over again
    // TODO: stop alarms triggereding after the minute they are supposed to
    // TODO: alert when the app is closed

    for (const event in events) {

        var now = new Date();
        var msFromDayToEpoch = Date.now();
        msFromDayToEpoch -= msFromDayToEpoch % 86400000; // day in ms

        msFromMinuteToDay = setDateTime(new Date(), events[event].startTime).getTime() % 86400000;

        var alarmInfo = {
            when: msFromDayToEpoch + msFromMinuteToDay, // every day at the specificed time
        }

        chrome.alarms.create(events[event].name, alarmInfo)
        chrome.alarms.onAlarm.addListener(function (alarm) {
            console.log(alarm.name)
            var message = "Your " + events[alarm.name].startTime + "class is starting, click here to join!";
            sendNotification(alarm.name, message, events[alarm.name].link);
        })
    }
}

// if (eventTime == now) {
//     console.log("SUCCESS");
//     var message = "Your " + event.startTime + "class is starting, click here to join!";
//     sendNotification(event.name, message, event.link);
// }

load("schedule", "scheduleTable");
// clear()
newRow();
setupTable();
main();

function interval(duration, fn) {
    this.baseline = undefined

    this.run = function () {
        if (this.baseline === undefined) {
            this.baseline = new Date().getTime()
        }
        fn()
        var end = new Date().getTime()
        this.baseline += duration

        var nextTick = duration - (end - this.baseline)
        if (nextTick < 0) {
            nextTick = 0
        }
        (function (i) {
            i.timer = setTimeout(function () {
                i.run(end)
            }, nextTick)
        }(this))
    }

    this.stop = function () {
        clearTimeout(this.timer)
    }
}