IOT Dashboard Admin for Insight
==================

Deploy the application:

1. Register to Bluemix:
    https://console.ng.bluemix.net
    
2. Create a new Javascript web app on Bluemix, give it a unique name. (Create App -> Web application -> Javascript runtime)

3. Download this project from Git => "Download ZIP" on the right
4. Unzipp this project
5. Open the command line and go to the project folder you just unzipped (cd "location")
6. Edit the manifest.yml file with the application that you have created in Bluemix. Modify the name and the host with the name you gave to your Bluemix application

7. Connect to Bluemix from the command line:

    cf api https://api.ng.bluemix.net

8. Log into Bluemix:

    cf login 

9. Deploy your app:

    cf push

10. Access your app: your bluemix-application-name.mybluemix.net
 


==================
How to customize the app:

#### Realtime data: 

   The components for the realtime data visualization are placed in the files realtime.js and realtimeGraph.js in this folder.

        public\js\realtime\
    
        \realtime.js
    
        \realtimeGraph.js

*realtimeGraph.js*: This file contains the graph and it's related functions.This is written in the same style as historianGraph.js above.So you can follow the guidelines for historianGraph.js to customize the code.

*realtime.js* : This file intializes the graph and subscribes to the mqtt topics to get realtime device data from IBM IOT cloud.


 *Change the color of the graph*: In the below section of code you can change the hexadecimal codes to change the color of the graph data.
    
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

 This instantiates the graph and set the intial renderer to line.

        
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
          }

