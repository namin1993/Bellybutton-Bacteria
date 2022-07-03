function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    console.log(metadata);

    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samplesArray = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var filteredSample_Array = samplesArray.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData_Array = data.metadata.filter(sampleObj => sampleObj.id == sample);

    // Create a variable that holds the first sample in the array.
    var firstSample = filteredSample_Array[0];

    // 2. Create a variable that holds the first sample in the metadata array.
    var firstMeta = metaData_Array[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = firstSample.otu_ids;
    var otu_labels = firstSample.otu_labels;
    var sample_values = firstSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var wfreq = firstMeta.wfreq;

    // Create the yticks for the bar chart.
    var yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();

    // Use Plotly to plot the bar data and layout.
    var barData = [{
      x: sample_values.slice(0,10).reverse(),
      y: yticks,
      text: otu_labels.slice(0,10).reverse(),
      type:"bar",
      orientation: 'h'
    }];

    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: {title: "Amount"}
    };

    Plotly.newPlot("bar", barData, barLayout);
    
    // Use Plotly to plot the bubble data and layout.
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        colorscale: 'YlGnBu',
        color: otu_ids
      },
      text: otu_labels
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Amount"}
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
   
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{

      value: wfreq,
      title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        bar: { color: "darkblue" },
        bgcolor: "white",
        borderwidth: 2,
        axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
        steps: [
          { range: [0, 2], color: "steelblue" },
          { range: [2, 4], color: "slategrey" },
          { range: [4, 6], color: "lightsteelblue" },
          { range: [6, 8], color: "cornflowerblue" },
          { range: [8, 10], color: "lavender" }
        ],
      }      
    }];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, 
      height: 500, 
      margin: { t: 0, b: 0 },
      paper_bgcolor: "white",
      font: { color: "darkblue", family: "Arial" },
      automargin: true
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}
