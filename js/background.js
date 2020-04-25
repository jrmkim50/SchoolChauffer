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
                    cellText = document.createTextNode(this.name);
                    break;
                case 1:
                    cellText = document.createTextNode(this.startTime); 
                    break;
                case 2:
                    cellText = document.createTextNode(this.endTime);
                    break;
                case 3:
                    cellText = document.createTextNode(this.link);
                    break;
                case 4:
                    cellText = document.createElement("button")
                    cellText.id = "delete"
                    cellText.onclick = function() {
                        tblBody.removeChild(row);
                        localStorage.setItem("scheduleTable", tbl.innerHTML);
                    }
                    break;
                default:
                    break;
            }
            cell.appendChild(cellText);
            cell.addEventListener("keyup", function() {
                if (checkInput(cell, columnNum)) {
                    save(tbl, "scheduleTable");
                }
            })
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
            console.log(j);
            if (j == 4) {
                var deleteButton = columns[j].getElementsByTagName("button")[0];
                deleteButton.addEventListener("click", function() {
                    var row = this.parentNode.parentNode
                    row.parentNode.removeChild(row);
                    save(tbl, "scheduleTable");
                });
            } else {
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
                    default:
                        cell.addEventListener("keyup", function() {
                            save(tbl, "scheduleTable");
                        })
                        break;
                }
            }
        }
    }
}

function myFunction() {
    document.getElementById("time").style.backgroundColor = "red";
}

function checkInput(object) {
    var text = object.textContent;
    var regex = new RegExp('(0[1-9]|1[012])[:]([0-5][0-9]) [A|P][M]')
    if (regex.test(text)) {
        return true;
    }
    return false;    
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

load("schedule", "scheduleTable");
// clear()
newRow();
setupTable();