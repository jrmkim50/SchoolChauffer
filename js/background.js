function displayTime() {
    var time = document.getElementById("time");
    window.onload = function(){
        time.innerHTML = Date();
    }
    setInterval(function(){ time.innerHTML = Date(); },1000);
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
            switch(columnNum) {
                case 0:
                    cell.addEventListener("keyup", function() {
                        save(tbl, "scheduleTable");
                    })
                    cellText = document.createTextNode(this.name);
                    break;
                case 1:
                    cell.addEventListener("keyup", function() {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    cellText = document.createTextNode(this.startTime);
                    break;
                case 2:
                    cellText = document.createTextNode(this.endTime);
                    cell.addEventListener("keyup", function() {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    break;
                case 3:
                    cell.addEventListener("keyup", function() {
                        save(tbl, "scheduleTable");
                    })
                    cellText = document.createTextNode(this.link);
                    break;
                case 4:
                    cellText = document.createElement("button")
                    cellText.onclick = function() {
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
            switch(j) {
                case 1:
                    cell.addEventListener("keyup", function() {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        } 
                    })
                    break;
                case 2:
                    cell.addEventListener("keyup", function() {
                        if (checkInput(this)) {
                            save(tbl, "scheduleTable");
                        }
                    })
                    break;
                case 4:
                    var deleteButton = cell.getElementsByTagName("button")[0];
                    cell.addEventListener("click", function() {
                        var row = this.parentNode
                        row.parentNode.removeChild(row);
                        save(tbl, "scheduleTable");
                    });
                default:
                    cell.addEventListener("keyup", function() {
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
    var match =  text.match(regex);
    return match && text === match[0];
}

function newRow() {
    var tbl = document.getElementById("schedule");
    var add = document.getElementById("add");
    add.onclick = function() {
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
    if (mer == "PM" && hours != 12){
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

function makeNotification(className) {
    var opt = {
        iconUrl: "http://www.google.com/favicon.ico",
        type: 'list',
        title: 'Primary Title',
        message: 'Primary message to display',
        priority: 1,
        items: [{ title: 'Item1', message: 'This is item 1.'},
              { title: 'Item2', message: 'This is item 2.'},
                { title: 'Item3', message: 'This is item 3.'}]
    };
    chrome.notifications.create('notify1', opt, function() { console.log('created!'); });      
}
  

makeNotification("Hello")
  

function showNotification() {
    setInterval(function() {
        var startTimes = [];
        var rows = document.getElementsByTagName("tr");
        for (i = 2; i < rows.length; i++) {
            var columns = rows[i].getElementsByTagName("td");
            makeNotification(columns[0].textContent);
            startTimes.push(columns[1].textContent);
        }
        // console.log(startTimes);
        for (i = 0; i < startTimes.length; i++) {
            var date = new Date();
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();

            var tableDate = new Date();
            tableDate = setDateTime(tableDate, startTimes[i]);
            var tableHours = tableDate.getHours();
            var tableMinutes = tableDate.getMinutes();
            var tableSeconds = tableDate.getSeconds();
            if (hours == tableHours && 
                minutes == tableMinutes && seconds == tableSeconds) {
                    console.log("SUCCESS");
                    var columns = rows[i].getElementsByTagName("td");
                    makeNotification(columns[0].textContent);
            } else {
            }
        }
        
     }, 1000);
}

load("schedule", "scheduleTable");
// clear()
newRow();
setupTable();
showNotification();
