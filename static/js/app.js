
// url for api call
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// data collection
let bbd = d3.json(url)

// initialization function
function init(data) {
    start = data.samples[0];
    id = data.metadata[0].id;
    startList = barChartPrep(start)
    bubbleList = bubbleChartPrep(start)
    barchart(startList.x, startList.y, startList.c, startList.t);
    bubbleChart(bubbleList.x, bubbleList.y,bubbleList.c,
        bubbleList.t,bubbleList.r);
    DemographicInfo(data, id)
};

// fills in drop down menu
function dropDown(otus) {
    let selectID = d3.select("#selDataset");

    ids = otus.samples
    idArray = ids.map(a => a.id)
    console.log(idArray);
    // add options to dropdown
    idArray.forEach(
        function(addID) {
            selectID
            .append("option")
            .attr("value", addID)
            .text(addID);
        }
);
};

// enables interactive dropdown
function getID (data) {
    let selectID = d3.select("#selDataset");
        
    selectID
        .on("change", function() {
            let id = d3.event.target.value;
            let found = data.samples.find(element => element.id === id);
//            console.log(found);
            let list = barChartPrep(found);
            barchart(list.x, list.y, list.c, list.t);
            
            DemographicInfo(data, id);
        }
        )
};

// does prep for barchart
function barChartPrep (temp) {

    let title = temp.id;
    let ids = temp.otu_ids.slice(0,10).map(a => `OTU ${a}`).reverse();
    let smpls = temp.sample_values.slice(0,10).reverse();
    let labels = temp.otu_labels.slice(0,10).reverse();
    let r = smpls;

    let list = {y: ids,x: smpls,c: labels, t: title, r: r};
    return list;
}

// plots barchart
function barchart(x,y,c,t) {
    trace = [{
        x: x,
        y: y,
        type: "bar",
        orientation: 'h',
        text:c
    }];
    layout = {
        title: `ID: ${t}`,
        autosize: false,
        width: 900,
        height: 400,
        margin: {
            l: 80,
            r: 50,
            b: 30,
            t: 100,
            pad: 4
        },
      };

    Plotly.newPlot("bar", trace, layout);
}

// does prep for bubble chart
function bubbleChartPrep(temp) {
    let title = 'OTU ID';
    let ids = temp.otu_ids;
    let smpls = temp.sample_values;
    let labels = temp.otu_labels;
    let r = smpls;
    console.log(r);
    let list = {x: ids,y: smpls,c: labels, t: title, r: r};
    return list;
}

// plots bubble chart
function bubbleChart(x,y,c,t,r) {
    trace = [{
        x: x,
        y: y,
        type: "scatter",
        text:c,
        mode: "markers",
        marker: {
            size: y,
            color: x,
            sizeref: 1.5,
          },
         
    }];
    layout = {
        xaxis: {
            title: {
                text: t
            }
        }
    };

    Plotly.newPlot("bubble", trace, layout);
}

// fills in demographic info from id selection
function DemographicInfo(data, id) {
    let found = data.metadata.find(element => element.id == id);
    console.log(data.metadata.find(element => element.id == id));

    cat = Object.keys(found);
    demo = Object.values(found);

    let clear = document.getElementById("sample-metadata");

    clear.replaceChildren();

    let x = d3.select(".panel-body").append("ul");
    for (let i = 0; i < cat.length; i++) {
        x.append("p").text(`${cat[i]}: ${demo[i]}`)
    }
}

// main body..calls fuctions and enables use of promise object
// more easily

bbd.then(function(data) {
    
    init(data);

    console.log(data);
    dropDown(data);

    getID(data);

   
   }
);





// selectMenu
//     .on("change",
//     function() {
//         console.log(d3.event.target.value);
//         let newCountry = d3.event.target.value;
//         let newCountryData = data[newCountry];
//         console.log(newCountry);
//         let values = Object.values(newCountryData);
//         Plotly.restyle("pie", "values", [values]);
//         }
//     );
