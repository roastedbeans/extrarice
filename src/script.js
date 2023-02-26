google.charts.load('current', {'packages':['corechart','line']});
google.charts.setOnLoadCallback(drawChart);

//Init Variables
let inflow = 0;
let outflow = 0;
let netcashflow = 0;
let interval = 0;
let originterval = 0;
let inflowreg = 0;
let outflowreg = 0;
var periodreg = 'Time Period';
var coords = [];
var arranged = [];
var datapointinp = document.getElementById("datapointinp");
var estimateinp = document.getElementById("estimateinp");
var resultEstimate = 0;

function errorMessage(message) {
    var error = document.querySelector(".alertarea");
    error.style.display = 'block';
    let code = `<strong><br>ALERT</strong><br><p>${message}</p>`

    error.innerHTML = code;

    var delayInMilliseconds = 1200;

    setTimeout(function() {
        error.style.display = 'none';
    }, delayInMilliseconds);
};

function storeCoordinate(xVal, yVal) {
    coords.push({x: xVal,y: yVal});

    coords.sort(function(a, b) {
    //sort by x, secondary by y
    return a.x == b.x ? a.y - b.y : a.x - b.x;
    });

    for (var i = 0; i < coords.length; i++) {

    //check if was already added
    if (typeof(coords[i].wasAdded) == "undefined") {
        arranged.push(coords[i]);
        coords[i].wasAdded = "true";

        for (j = i + 1; j < coords.length; j++) {
            if (coords[i].y > coords[j].y && typeof(coords[j].wasAdded) == "undefined") {
                arranged.push(coords[j]);
                coords[j].wasAdded = "true";
            }
        }
    }
    }
    console.log(arranged);
}


function drawChart() {
    // to loop through coordinate values
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'Time');
    data.addColumn('number', 'Data Points');
    for (var i = 0; i < interval; i++) {
        var timecoords = coords[i].x;
        var cashcoords = coords[i].y;
        data.addRow([timecoords, cashcoords]);
    }

  var options = {
    title: 'CASHFLOW',
    curveType: 'function',
    legend: { position: 'in' },
    backgroundColor: 'white',
    chartArea:{left:90,top:50,width:'80%',height:'60%'},
    colors: ['#2a593f'],
    fontName: 'Montserrat',
    fontSize: 14,
    dataOpacity: 1.0,
    selectionMode: 'multiple',
    pointsVisible: true,
    hAxis: {title: periodreg + ' (x)'},
    vAxis: {title: 'Net Cashflow ₱ (y)'}
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_lines'));
  var formatnumbers = new google.visualization.NumberFormat({
    prefix: '₱',
  });
  formatnumbers.format(data, 1);

  chart.draw(data, options);
}

//--- Interpolation and Extrapolation Function

// function to interpolate the given
// data points using Lagrange's formula
// xi corresponds to the new data point
// whose value is to be obtained n
// represents the number of known data points

var datapointset = [];
let netcashflowreg = [];
var datapointcount = 0;
var estimatevalarr = [];
var estimatecount = 0;

function interpolate(xi,n)
{
    let result = 0; // Initialize result
 
    for (let i = 0; i < n; i++)
    {
        // Compute individual terms of above formula
        let term = datapointset[i].y;
        for (let j = 0; j < n; j++)
        {
            if (j != i)
                term = term*(xi - datapointset[j].x) / (datapointset[i].x - datapointset[j].x);
        }
   
        // Add current term to result
        result += term;
    }
    result = Number(result.toFixed(2));
    resultEstimate = result;
    interval ++;
    storeCoordinate(xi, result);
   
    drawChart();
}
 
// Driver code
 // creating an array of 4 known data points

// Using the interpolate function to obtain

function toInterpolate() {
    var estimatecontainer = document.querySelector(".estimatelist");
    var estimateval = Number(estimateinp.value);
    
    if(interval < 4) {
        errorMessage("Insufficient Data");
        estimateinp.value = "";
    }
    else {
        if(datapointinp.value > interval) {
            errorMessage("Invalid Data Point");
            datapointinp.value = "";
        }
        else if (datapointcount < 4) {
            errorMessage("Atleast 4 Data Points Required");
            estimateinp.value = "";
        }
        else if (estimateinp.value == '') {
            errorMessage("Invalid Estimate Value");
            estimateinp.value = "";
        }
        else {
            for(var i = 0; i < estimatevalarr.length; i++) {
                if(estimateval == estimatevalarr[i]) {
                    console.log("Repeated");
                    estimateinp.value = "";
                    return;
                };
            }

            interpolate(estimateval, datapointcount);
            let code = `(${estimateval},${resultEstimate}) `;

            if(estimatecontainer != null)
            {
                estimatevalarr[estimatecount] = estimateval;
                estimatecount ++;
                estimatecontainer.innerHTML += code;
                estimateinp.value = "";
            }
        }
    }
}

function addDataPoint() {
    var datacontainer = document.querySelector(".datapointslist");
    var datapoint = parseInt(datapointinp.value);

    for(var i = 0; i < datapointset.length; i++) {
        if(datapoint == datapointset[i].x){
            console.log("Repeated");
            datapointinp.value = "";
            return;
        }
    }
    
    if(datapoint <= originterval)
    {   
        datapointcount ++;
        datapointset.push({x: datapoint,y: netcashflowreg[datapoint]});
    
        let code = `(${datapoint},${netcashflowreg[datapoint]}) `;

        if(datacontainer != null)
        {
            datacontainer.innerHTML += code;
            datapointinp.value = "";
        }
    }
    else {
        errorMessage("Invalid Data");
        datapointinp.value = "";
    }
}

//------- End of Function 

function addIncome() {
    descriptionIN = document.getElementById("descriptionIN").value;
    amountIN  = document.getElementById("amountIN").value;

    if(descriptionIN == "" || amountIN == "")
    {
        errorMessage("Invalid Input");
    }
    else{
        var flagIN = 0;
        addRow(descriptionIN, amountIN, flagIN);
    }
    
}

function addExpense() {
    descriptionOUT = document.getElementById("descriptionOUT").value;
    amountOUT  = document.getElementById("amountOUT").value;

    if(descriptionOUT == "" || amountOUT == "")
    {
        errorMessage("Invalid Input");
    }
    else{
        var flagOUT = 1;
        addRow(descriptionOUT, amountOUT, flagOUT);
    }
    
}

function toCashflow(amount, flag) {

    let net = document.getElementById("net");

    if (flag == 0)
    {
        inflow += parseFloat(amount);
    }
    else if (flag == 1)
    {
        outflow += parseFloat(amount);
    }
    netcashflow = inflow - outflow;
    net.innerHTML = "₱ " + netcashflow.toFixed(2);
}

function addRow(description, amount, flag) {
     var table = document.getElementById("table");
     var td1 = document.createElement("td");
     var td2 = document.createElement("td"); 
     var row = document.createElement("tr");

     td1.innerHTML = description;
     td2.innerHTML  = amount;
 
     row.appendChild(td1);
     row.appendChild(td2);
     
     table.children[0].appendChild(row);
     if(flag == 0){
        row.style.backgroundColor = "#a4edc4";
        document.getElementById("descriptionIN").value = '';
        document.getElementById("amountIN").value = '';
        toCashflow(amount, flag);
     }
     else if(flag == 1){
        row.style.backgroundColor = "lightcoral";
        document.getElementById("descriptionOUT").value = '';
        document.getElementById("amountOUT").value = '';
        toCashflow(amount, flag);
     }
 };

 
function displayCashflow() {
    inflowreg += inflow;
    outflowreg += outflow;
    
    periodreg = document.getElementById("periodicity").value;
    
  if(inflow == 0 && outflow == 0){
    errorMessage("Nothing to Register");
  }
  else{
    interval ++;
    originterval ++;
    netcashflowreg[originterval] = netcashflow;
    var tableflow = document.getElementById("tableflow");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td"); 
    var td3 = document.createElement("td"); 
    var td4 = document.createElement("td"); 
    var row = document.createElement("tr");
   
    td1.innerHTML = originterval;
    td2.innerHTML  = inflow;
    td3.innerHTML = 0-outflow;
    td4.innerHTML = netcashflow;

    if(netcashflow > 0) {
        row.style.backgroundColor = "#a4edc4";
    }
    else if(netcashflow < 0) {
        row.style.backgroundColor = "lightcoral";
    }
    else if(netcashflow == 0) {
        row.style.backgroundColor = "#cfcfd9";
    }

    row.appendChild(td1);
    row.appendChild(td2);
    row.appendChild(td3);
    row.appendChild(td4);
    
    tableflow.children[0].appendChild(row);
    document.getElementById("descriptionIN").value = '';
    document.getElementById("amountIN").value = '';
    document.getElementById("descriptionOUT").value = '';
    document.getElementById("amountOUT").value = '';
    
    var tablehead = document.getElementById("table-head");
    //e.firstElementChild can be used.
    var child = tablehead.lastElementChild;
    while (child) {
        tablehead.removeChild(child);
        child = tablehead.lastElementChild;
    }
    document.getElementById('net').innerHTML = "₱ 0";

    storeCoordinate(originterval, netcashflow);
    drawChart();
    inflow = 0;
    outflow = 0;
    netcashflow = 0;
    var period = document.getElementById("periodicity").style;
    period.backgroundColor = "rgba(255,255,255,0.5)";
    period.pointerEvents = "none";
  }
  
};

//Sidebar

/* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the sidebar to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }