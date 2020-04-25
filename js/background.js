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
  
        // creates a <table> element and a <tbody> element
        var tbl = document.getElementById("schedule");
        var tblBody = document.getElementById("schedule body");
    
        var row = document.createElement("tr");
        
        for (var columnNum = 0; columnNum < 5; columnNum++) {
            // Create a <td> element and a text node, make the text
            // node the contents of the <td>, and put the <td> at
            // the end of the table row
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
                    cellText.onclick = function() {
                        tblBody.removeChild(row)
                    }
                    cellText.id = "cancel"
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

function newRow() {
    var add = document.getElementById("add")
    add.onclick = function() {
        var scheduleItem = new ScheduleItem("", "", "", "")
        scheduleItem.addToTable()
    }
}

newRow()