/*******************************************************************************
* Copyright (c) 2014 IBM Corporation and other Contributors.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
* IBM - Initial Contribution
*******************************************************************************/

var RealtimeGraph = function(){

	var palette = new Rickshaw.Color.Palette( { scheme: [
        "#7f1c7d",
 		"#00b2ef",
		"#00649d",
		"#00a6a0",
		"#ee3e96",
		"#FF6600",
		"#33CC33",
		"#996633",
		"#00FFFF",
		"#FFFF00",
		"#999966",
		"#003300",
		"#CC0000",
		"#993333",
		"#009933"

    ] } );
	
	// function to invoke Rickshaw and plot the graph
	this.drawGraph = function(seriesData)
	{
		// instantiate our graph!
		this.palette = palette;
		if(document.getElementById("chart") != null){
			this.graph = new Rickshaw.Graph( {
				element: document.getElementById("chart"),
				width: 600,
				height: 250,
				renderer: 'line',
				stroke: true,
				preserve: true,
				series: seriesData	
			} );
		}else{
			return null;
		}
		

		this.graph.render();

		this.hoverDetail = new Rickshaw.Graph.HoverDetail( {
			graph: this.graph,
			xFormatter: function(x) {
				return new Date(x * 1000).toString();
			}
		} );

		this.annotator = new Rickshaw.Graph.Annotate( {
			graph: this.graph,
			element: document.getElementById('timeline')
		} );

		this.legend = new Rickshaw.Graph.Legend( {
			graph: this.graph,
			element: document.getElementById('legend')

		} );

		this.shelving = new Rickshaw.Graph.Behavior.Series.Toggle( {
			graph: this.graph,
			legend: this.legend
		} );

		this.order = new Rickshaw.Graph.Behavior.Series.Order( {
			graph: this.graph,
			legend: this.legend
		} );

		this.highlighter = new Rickshaw.Graph.Behavior.Series.Highlight( {
			graph: this.graph,
			legend: this.legend
		} );

		this.smoother = new Rickshaw.Graph.Smoother( {
			graph: this.graph,
			element: document.querySelector('#smoother')
		} );

		this.ticksTreatment = 'glow';

		this.xAxis = new Rickshaw.Graph.Axis.Time( {
			graph: this.graph,
			ticksTreatment: this.ticksTreatment,
			timeFixture: new Rickshaw.Fixtures.Time.Local()
		} );

		this.xAxis.render();

		this.yAxis = new Rickshaw.Graph.Axis.Y( {
			graph: this.graph,
			tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
			ticksTreatment: this.ticksTreatment
		} );

		this.yAxis.render();


		this.controls = new RenderControls( {
			element: document.querySelector('form'),
			graph: this.graph
		} );

	}

	this.updateVal = function(data)
	{
		var i=0;
		var v=0;
		for (var j in data.d)
		{
			if (typeof data.d[j] !== 'string') {
				if((j == 'Loudness') && (document.getElementById('loudness')!= null)){
					document.getElementById('loudness').innerHTML = Math.round(data.d[j] *100) +" %";
				}else if((j == 'Power') && (document.getElementById('power') != null)){
					document.getElementById('power').innerHTML = data.d[j];
				}else if((j == 'Light') && (document.getElementById('light') != null )){
					document.getElementById('light').innerHTML = Math.round(data.d[j]*100) +" %";
				}else if((j == 'Motion') && (document.getElementById('motion') != null)){
					//document.getElementById('motion').innerHTML = data.d[j];
					if(document.getElementById('motion-text') != null){
						if(data.d[j] == 0){
							document.getElementById('motion').className = "fa fa-male fa-5x";
							document.getElementById('motion-text').innerHTML = "No detected presence";
						} else {
							document.getElementById('motion').className = "fa fa-child fa-5x";
							document.getElementById('motion-text').innerHTML = "Detected presence";
						}
					}else{
						document.getElementById('motion').innerHTML = data.d[j];
					}
					
				}else if((j == 'v_bat') || (j == 'State')) {
					if(document.getElementById('voltage_b') != null ){ //home page
						if(j == 'v_bat'){
							document.getElementById('voltage_b').innerHTML = ((data.d[j]/1000)*3).toFixed(1);
						}
						
					}
					if(document.getElementById('charge') != null ){ // Energy production page
						if(j == 'v_bat'){
							document.getElementById('charge').innerHTML = ((((data.d[j]/1000)*3)*100)/270).toFixed(1);
						}else if(j == 'State'){
							if(data.d[j]=='1'){ // A verifier lamp allumée
								document.getElementById('lamp').innerHTML = "Turned On";
								document.getElementById('charging-img').style.display='none';
								document.getElementById('discharging-img').style.display='block';
							}else {
								document.getElementById('lamp').innerHTML = "Turned Off";
								document.getElementById('charging-img').style.display='block';
								document.getElementById('discharging-img').style.display='none';

							}//A VERIFIER
						}
					}
				}
					
				else if((j == 'v_iphoto') && (document.getElementById('intensity') != null)){
					document.getElementById('intensity').innerHTML = data.d[j];
					i=data.d[j];
				}else if((j == 'v_vphoto') && (document.getElementById('voltage') != null)){
					document.getElementById('voltage').innerHTML = (data.d[j]/1000).toFixed(1);
					v=data.d[j]/1000;
				}
			}
		}
		if(document.getElementById('power_s') != null){
			document.getElementById('power_s').innerHTML = (i*v).toFixed(1);
		}
		
		
	}
		    
	this.graphData = function(data)
	{
		if((this.graph != null) && (document.getElementById('charge') == null )){
			var key = 0;
			var seriesData = [];
			var timestamp = Date.now()/1000;
			var maxPoints = 25; 
			for (var j in data.d)
			{
				if (typeof data.d[j] !== 'string') {
					this.graph.series[key].data.push({x:timestamp,y:data.d[j]});
					if (this.graph.series[key].data.length > maxPoints)
					{
						this.graph.series[key].data.splice(0,1);//only display up to maxPoints
					}
					key++;
				}
			}
			this.graph.render();
		}
			
	}
	this.graphDataCharge = function(data)
	{
		if(document.getElementById('charge') != null ){
			var key = 0;
			var seriesData = [];
			var timestamp = Date.now()/1000;
			var maxPoints = 25; 
			for (var j in data.d)
			{
				if (typeof data.d[j] !== 'string') {
					if(j == 'v_bat'){
						this.graph.series[key].data.push({x:timestamp,y:data.d[j]});
						if (this.graph.series[key].data.length > maxPoints)
						{
							this.graph.series[key].data.splice(0,1);//only display up to maxPoints
						}
						key++;
					}
					
				}
			}
			this.graph.render();
		}
			
	}
	this.updateGauge = function(data)
	{
		if(document.getElementById('gauge') != null){
			for (var j in data.d)
			{
				if (typeof data.d[j] !== 'string') {
					if(j == 'Loudness'){
						
						needle.moveTo(data.d[j]);
						break;
					}
				}
			}
		}
		
		
	}
	this.displayChart = function(device,data){
		if( document.getElementById('charge') == null ){

			var key = 0;
			var seriesData = [];
			var timestamp = Date.now()/1000;
			for (var j in data.d)
			{	
				if (typeof data.d[j] !== 'string') {
					seriesData[key]={};
					seriesData[key].name=j;
					seriesData[key].color = palette.color();
					seriesData[key].data=[];

					seriesData[key].data[0]={};
					seriesData[key].data[0].x = timestamp;
					seriesData[key].data[0].y = data.d[j];
					key++;
				}
				
			}

			this.drawGraph(seriesData);
		}
	}
	this.displayChartCharge = function(device,data){
		if(document.getElementById('charge') != null ){

			var key = 0;
			var seriesData = [];
			var timestamp = Date.now()/1000;
			for (var j in data.d)
			{
				if (typeof data.d[j] !== 'string') {
					if(j == 'v_bat'){
						seriesData[key]={};
						seriesData[key].name=j;
						seriesData[key].color = palette.color();
						seriesData[key].data=[];

						seriesData[key].data[0]={};
						seriesData[key].data[0].x = timestamp;
						seriesData[key].data[0].y = (data.d[j]/1000)*3;
						key++;
					}
					
				}
			}

			this.drawGraph(seriesData);
		}
	}

};
