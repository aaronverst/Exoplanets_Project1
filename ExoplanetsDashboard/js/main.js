//let Barchart;
//let StarTypeChart;
d3.csv('data/exoplanets-1.csv')
  .then(data => {
    data.forEach(d => {
      d.sy_snum = +d.sy_snum;
      d.sy_pnum = +d.sy_pnum;
      d.st_spectype = d.st_spectype;
      d.discoverymethod = d.discoverymethod;
      d.pl_orbsmax = +d.pl_orbsmax;
      d.sy_dist = +d.sy_dist;
      d.disc_year = +d.disc_year
    });

    let ZoneData = data;

    var Zones = [
      { 'zone': "A", 'NonHabitable': 0, 'Habitable': 0 },
      { 'zone': "F", 'NonHabitable': 0, 'Habitable': 0 },
      { 'zone': "G", 'NonHabitable': 0, 'Habitable': 0 },
      { 'zone': "K", 'NonHabitable': 0, 'Habitable': 0 },
      { 'zone': "M", 'NonHabitable': 0, 'Habitable': 0 }
    ];

    // Sort data by population
    data.sort((a, b) => a.sy_snum - b.sy_snum);
    data.sort((a, b) => a.sy_pnum - b.sy_pnum);
    data.sort((a, b) => a.disc_year - b.disc_year);
    //data.sort((a, b) => a.st_spectype - b.st_spectype);

    var numstars = d3.rollups(data, d => d.length, d => d.sy_snum);
    var numplanets = d3.rollups(data, d => d.length, d => d.sy_pnum);
    var StarType = d3.rollups(data, d => d.length, d => d.st_spectype);
    var DiscType = d3.rollups(data, d => d.length, d => d.discoverymethod);
    var ExoplanetDist = d3.rollups(data, d => d.length, d => d.sy_dist);
    var DiscYear = d3.rollups(data, d => d.length, d => d.disc_year);

    //Zone Definitions for Stacked Barchart
    for (let i = 0; i < 5243; i++) {
      if ((ZoneData[i].st_spectype).charAt(0) == "A" && (ZoneData[i].pl_orbsmax > 8.5) && (ZoneData[i].pl_orbsmax < 12.5)) {
        Zones[0].Habitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "A" && ((ZoneData[i].pl_orbsmax < 8.5) || (ZoneData[i].pl_orbsmax > 12.5))) {
        Zones[0].NonHabitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "F" && (ZoneData[i].pl_orbsmax > 1.5) && (ZoneData[i].pl_orbsmax < 2.2)) {
        Zones[1].Habitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "F" && ((ZoneData[i].pl_orbsmax < 1.5) || (ZoneData[i].pl_orbsmax > 2.2))) {
        Zones[1].NonHabitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "G" && (ZoneData[i].pl_orbsmax > .95) && (ZoneData[i].pl_orbsmax < 1.4)) {
        Zones[2].Habitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "G" && ((ZoneData[i].pl_orbsmax < .95) || (ZoneData[i].pl_orbsmax > 1.4))) {
        Zones[2].NonHabitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "K" && (ZoneData[i].pl_orbsmax > .38) && (ZoneData[i].pl_orbsmax < .56)) {
        Zones[3].Habitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "K" && ((ZoneData[i].pl_orbsmax < .38) || (ZoneData[i].pl_orbsmax > .56))) {
        Zones[3].NonHabitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "M" && (ZoneData[i].pl_orbsmax > .08) && (ZoneData[i].pl_orbsmax < .12)) {
        Zones[4].Habitable += 1;
      }
      else if ((ZoneData[i].st_spectype).charAt(0) == "M" && ((ZoneData[i].pl_orbsmax < .08) || (ZoneData[i].pl_orbsmax > .12))) {
        Zones[4].NonHabitable += 1;
      }
    }

    // Initialize chart and then show it
    barchart = new Barchart({ parentElement: '#StarChart' }, numstars);
    barchart.updateVis();

    barchart2 = new PlanetBarchart({ parentElement: '#PlanetChart' }, numplanets);
    barchart2.updateVis();

    barchart3 = new StarTypeChart({ parentElement: '#StarTypeChart' }, StarType);
    barchart3.updateVis();

    barchart4 = new DiscoveryTypeChart({ parentElement: '#DiscoveryTypeChart' }, DiscType);
    barchart4.updateVis();

    barchart5 = new StackedBarChart({ parentElement: '#HabitableExoplanets' }, Zones);
    barchart5.updateVis();

    linechart1 = new LineChart({ parentElement: '#DiscoveryYear' }, DiscYear);
    linechart1.updateVis();

    histogram1 = new DistanceHistogram('data/exoplanets-Dist.csv', 'histogram');
    histogram1.createHistogram('data/exoplanets-Dist.csv', 'histogram');
  })
  .catch(error => console.error(error));


/**
 * Event listener: change ordering
 */
/*
var changeSortingOrder = d3.select("#change-sorting").on("click", function() {
    reverse = !reverse;
    updateVisualization();
});
*/

d3.select('#sorting').on('click', d => {
  barchart.config.reverseOrder = true;
  barchart.updateVis();
  barchart2.config.reverseOrder = true;
  barchart2.updateVis();
})