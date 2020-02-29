const margin = { 
    top: 50, 
    right: 50, 
    bottom: 20, 
    left: 50
};
  
const width = 1300 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select('body').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const overlay = d3.select('body')
    .append('div').
    attr('class', 'overlay').
    style('opacity', 0);

const tooltip = d3.select('body')
    .append("div").
    attr("id", "tooltip").
    style("opacity", 0);

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(json => {
        this.data = json;
        draw(this.data);
    })

const x = d3.scaleLinear()
    .range([0, width]);

const xAxis = d3.axisTop()
    .scale(x);

svg.append('g')
    .attr('class', 'x-axis')
    .call(xAxis);

const y = d3.scaleBand()
    .range([0, height]);

const yAxis = d3.axisLeft()
    .scale(y);

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis);

svg.append("text")
    .attr("x", (width / 2))
    .attr("y", margin.top + 20)
    .attr("id", "title")
    .attr("text-anchor", "middle")
    .style("font-size", "22px")
    
svg.append("text")
    .attr("x", width + margin.top - 200)
    .attr("y", height - margin.bottom - 500)
    .attr("id", "axisText")
    .attr("text-anchor", "end")
    .style("font-size", "11px")


function draw(info) {
    const barHeight = 1.8;
    const barOffset = 0.1;
    const valueRange = [
        0,
        d3.max(info.data, i => i[1])
    ];

    x.domain(valueRange);

    const years = [];
    const minYear = d3.min(info.data, i => new Date(i[0]).getFullYear());
    const maxYear = d3.max(info.data, i => new Date(i[0]).getFullYear());
    for (let i = minYear; i < maxYear; i += 5){
        years.push(i);
    }
    
    y
    .domain(years)
    .range([0, info.data.length * barHeight + info.data.length * barOffset - barOffset]);

    const bars = svg.selectAll('.bar').data(info.data);

    const addBar = bars
        .enter()
        .append('rect')
        .attr('height', barHeight)
        .attr('class', 'bar')
        .on("mouseover", (d, i) => {            
            overlay.transition().
            duration(0).
            style('width', d + 'px').
            style('height', barHeight + 'px').
            style('opacity', .9).
            style('top', i * barHeight + 0 + 'px').
            style('left', height - d + 'px').
            style('transform', 'translateX(60px)');
            tooltip.transition().
            duration(200).
            style('opacity', .9);
            tooltip.html('$' + i + ' billion ' + '<br>' + d[0])
            .style('top', i * barHeight + 30 + 'px').
            style('left', height - 100 + 'px').
            style('transform', 'translateX(60px)');
        })
        .on('mouseout', function (d) {
            tooltip.transition().
            duration(200).
            style('opacity', 0);
            overlay.transition().
            duration(200).
            style('opacity', 0);
          });

    addBar.merge(bars)
        .transition()
        .duration(1000)
            .attr('width', i => x(i[1]))
            .attr('y', (i, n) => n * barHeight + n * barOffset)
            .attr('data-date', i => i[0])
            .attr('data-gdp', i => '$' + i[1] + ' billion ')

    svg
        .select('.x-axis')
        .transition()
        .call(xAxis);
    svg
        .select('.y-axis')
        .transition()
        .call(yAxis);
    svg
        .select('#title')
        .text(info.source_name);

    svg
        .select('#axisText')
        .text(info.name.split(',')[0]);

}