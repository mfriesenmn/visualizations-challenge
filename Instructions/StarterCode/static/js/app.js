d3.json('samples.json').then(data => {
	populateDropdown(data);
	var selectedId = document.getElementById("selDataset").value;
	plotbar(data.samples, selectedId);
	showDemographicData(data.metadata, selectedId);
	plotbubble(data.samples, selectedId);
});

function showDemographicData(data, selectedId){
	var destination = document.getElementById("sample-metadata");
	participantdata = data.find(participantdata => participantdata.id == selectedId)
	destination.innerHTML =
		"<p>ID: <b>"+ participantdata.id + "</b></p>" +
		"<p> Ethnicity <b>" + participantdata.ethnicity + "</b></p>" +
		"<p> Gender <b>" + participantdata.gender + "</b></p>" +
		"<p> Age <b>" + participantdata.age + "</b></p>" +
		"<p> Location <b>" + participantdata.location + "</b></p>" +
		"<p> BB Type <b>" + participantdata.bbtype + "</b></p>" +
		"<p> Wash Frequency <b>" + participantdata.wfreq + "</b></p>";
}

function populateDropdown(data){
	var pulldown = document.getElementById("selDataset")
	for (var bacteria of data.samples){
		newoption = document.createElement("option");
		newoption.text = bacteria.id.toString();
		pulldown.append(newoption);
	}
}

function optionChanged(){
	var selectedId = document.getElementById("selDataset").value;
	d3.json('samples.json').then(data => {
		plotbar(data.samples, selectedId);
		showDemographicData(data.metadata, selectedId);
		plotbubble(data.samples, selectedId);
	});
}


function plotbar(data, selectedId){
	var destination = document.getElementById("bar");
	Plotly.purge(destination);
	var sample = data.find(sample => sample.id == selectedId )
	var samplesArray = [];
	for (var i = 0; i < sample.otu_labels.length; i++){
		samplesArray.push({
			sample_value : sample.sample_values[i],
			otu_label : sample.otu_labels[i],
			otu_id : "OTU" + sample.otu_ids[i],
		})
	}
	samplesArray.sort((a,b) => b.sample_value - a.sample_value);
	console.log(samplesArray);
	samplesArray.length=10;
	samplesArray.reverse();
	Plotly.plot( destination, [{
			x: samplesArray.map(x => x.sample_value),
			y: samplesArray.map(x => x.otu_id),
			text: samplesArray.map(x => x.otu_label),
			type: 'bar',
			orientation: 'h'
		}
	],
	{
		title: 'Sample Values of Navel Bacteria',
		xaxis: {title: {text: "Sample Values"}},
		yaxis: {title: {text: "OTU ID"}}
	});
}

function plotbubble(data, selectedId){
	var destination = document.getElementById("bubble");
	Plotly.purge(destination);
	var sample = data.find(sample => sample.id == selectedId )
	Plotly.plot(destination,
		[{
			x: sample.sample_values,
			y: sample.otu_ids,
			text: sample.otu_labels,
			mode: 'markers',
			marker: {
				size: sample.sample_values,
				color: sample.otu_ids
			}
		}],
		{
			title: 'Sample Values of Navel Bacteria',
			xaxis: {title: {text: "OTU ID"}},
			yaxis: {title: {text: "Sample Values"}}
		}
		
		
		
	)
}