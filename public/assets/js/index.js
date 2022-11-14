$(function() {
    "use strict";

     // chart 1
	 
		  var ctx = document.getElementById('chart1').getContext('2d');
		  let jan =Number(document.getElementById("jan").value);
		  let feb =Number(document.getElementById("feb").value);
		  let mar =Number(document.getElementById("mar").value);
		  let apr =Number(document.getElementById("apr").value);
		  let may =Number(document.getElementById("may").value);
		  let jun =Number(document.getElementById("jun").value);
		  let jul =Number(document.getElementById("jul").value);
		  let aug =Number(document.getElementById("aug").value);
		  let sep =Number(document.getElementById("sep").value);
		  let oct =Number(document.getElementById("oct").value);
		  let nov =Number(document.getElementById("nov").value);
		  let dec =Number(document.getElementById("dec").value);
		  
		
			var myChart = new Chart(ctx, {
				type: 'line',
				data: {
					labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct","Nov","Dec"],
					datasets: [{
						label: 'Orders',
						data: [jan, feb, mar, apr, may, jun, jul, aug, sep, oct,nov,dec],
						backgroundColor: '#fff',
						borderColor: "transparent",
						pointRadius :"0",
						borderWidth: 3
					},
					//  {
					// 	label: 'Old Visitor',
					// 	data: [7, 5, 14, 7, 12, 6, 10, 6, 11, 5,9,6],
					// 	backgroundColor: "rgba(255, 255, 255, 0.25)",
					// 	borderColor: "transparent",
					// 	pointRadius :"0",
					// 	borderWidth: 1
					// }
				]
				},
			options: {
				maintainAspectRatio: false,
				legend: {
				  display: false,
				  labels: {
					fontColor: '#ddd',  
					boxWidth:40
				  }
				},
				tooltips: {
				  displayColors:false
				},	
			  scales: {
				  xAxes: [{
					ticks: {
						beginAtZero:true,
						fontColor: '#ddd'
					},
					gridLines: {
					  display: true ,
					  color: "rgba(221, 221, 221, 0.08)"
					},
				  }],
				   yAxes: [{
					ticks: {
						beginAtZero:true,
						fontColor: '#ddd'
					},
					gridLines: {
					  display: true ,
					  color: "rgba(221, 221, 221, 0.08)"
					},
				  }]
				 }

			 }
			});  
		
		
    // chart 2

		var ctx = document.getElementById("chart2").getContext('2d');
		let cancelled =Number(document.getElementById("cancelled").innerHTML)
		let shipped =Number(document.getElementById("shipped").innerHTML)
		let packed =Number(document.getElementById("packed").innerHTML)
		let ordered =Number(document.getElementById("ordered").innerHTML)
		
			var myChart = new Chart(ctx, {
				type: 'doughnut',
				data: {
					labels: ["Ordered", "Packed", "Shipped", "Cancelled"],
					datasets: [{
						backgroundColor: [
							"#ffffff",
							"rgba(255, 255, 255, 0.70)",
							"rgba(255, 255, 255, 0.50)",
							"rgba(255, 255, 255, 0.20)"
						],
						data: [ordered, packed, shipped, cancelled],
						borderWidth: [0, 0, 0, 0]
					}]
				},
			options: {
				maintainAspectRatio: false,
			   legend: {
				 position :"bottom",	
				 display: false,
				    labels: {
					  fontColor: '#ddd',  
					  boxWidth:15
				   }
				}
				,
				tooltips: {
				  displayColors:false
				}
			   }
			});
		

		
		
   });	 
   