var global = {};
global.reservoir_min_opacity = 0.04;
global.reservoir_max_opacity = 0.15;

var color = {
  cambridge: '#a3c1ad',
  oxford: '#002147',
  bristol: '#a6192e',
  manchester: '#752095',
  glasgow: '#003855',
  warwick: 'black',
  durham: '#0038a8',
  edinburgh: '#91acdb',
  ucl: '#583094',
  salford: '#0e1f28',
  sussex: '#0e1f28'
  
};

init();

function init() {
  // load data
  d3.json('data/cambridge.json', function(data_cambridge) {
  d3.json('data/oxford.json', function(data_oxford) {
  d3.json('data/manchester.json', function(data_manchester) {
  d3.json('data/glasgow.json', function(data_glasgow) {
  d3.json('data/bristol.json', function(data_bristol) {
  d3.json('data/warwick.json', function(data_warwick) {
  d3.json('data/durham.json', function(data_durham) {
  d3.json('data/edinburgh.json', function(data_edinburgh) {
  d3.json('data/salford.json', function(data_salford) {
  d3.json('data/sussex.json', function(data_sussex) {
  d3.json('data/ucl.json', function(data_ucl) {
    doIt(data_cambridge, 'cambridge');
    
    doIt(data_oxford, 'oxford');
    flipTheBrotha('oxford', -502, -300, -44, -17, 15, -190);
    
    doIt(data_manchester, 'manchester');
    
    doIt(data_glasgow, 'glasgow');
    flipTheBrotha('glasgow', -502, -90, -44, -18, 15, -55);
    
    doIt(data_bristol, 'bristol');
    
    doIt(data_warwick, 'warwick');
    flipTheBrotha('warwick', -502, -90, -44, -18, 15, -55);
    
    doIt(data_durham, 'durham');
    
    doIt(data_edinburgh, 'edinburgh');
    flipTheBrotha('edinburgh', -502, -55, -44, -22, 15, -45);
    
    doIt(data_salford, 'salford');
    
    doIt(data_sussex, 'sussex');
    flipTheBrotha('sussex', -502, -55, -44, -22, 15, -45);

    doIt(data_ucl, 'ucl');

    resize_svgs();
  });
  });
  });
  });
  });
  });
  });
  });
  });
  });
  });
}

function flipTheBrotha(university, flip_x, flip_y, translate_text_x, translate_text_y,
    translate_first_text_x, translate_first_text_y
  ) {
  d3.select('.' + university + ' g')
    .attr('transform', 'rotate(180) translate(' + flip_x + ', ' + flip_y + ')');

  d3.selectAll('.' + university + ' text')
    .attr('text-anchor', 'end')
    .attr('transform', 'scale(-1,-1) translate(' + translate_text_x + ', ' + translate_text_y + ')');

  d3.select('.' + university + ' text')
    .attr('text-anchor', 'start')
    .attr('transform', 'scale(-1,-1) translate(' + translate_first_text_x + ', ' + translate_first_text_y + ')');
}

function doIt(data, university) {
  var svg = d3.select('svg.' + university)

  var margin = {
    top: 5,
    right: 1,
    bottom: 10,
    left: 1
  };
  var width = +svg.attr('width');
  var height = (+svg.attr('height') > 0)
    ? +svg.attr('height')
    : +svg.attr('default-height')


  var sankey = d3.sankey()
    .nodeWidth(16)
    .nodePadding(10)
    .size([width, height]);

  var path = sankey.link();

  svg = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  sankey
    .nodes(data.nodes)
    .links(data.links)
    .layout(32);

  var link = svg.append('g').selectAll('.link')
    .data(data.links)
    .enter().append('path')
    .attr('class', 'link')
    .attr('d', path)
    .style('stroke-width', function(d) {
      return Math.max(1, d.dy);
    })
    .sort(function(a, b) {
      return b.dy - a.dy;
    });

  var node = svg.append('g').selectAll('.node')
    .data(data.nodes)
    .enter().append('g')
    .attr('class', 'node')
    .attr('transform', function(d) {
      return 'translate(' + d.x + ',' + d.y + ')';
    });

  node.append('rect')
    .attr('height', function(d) {
      return d.dy;
    })
    .attr('width', sankey.nodeWidth())
    .attr('class', function(d) {
      return d.org;
    })
    .style('fill', function(d) {
      return d.color = color[d.org.replace(/ /g, '')];
    })
    .style('stroke', 'none');

  node.append('text')
    .attr('x', -6)
    .attr('y', function(d) {
      return d.dy / 2;
    })
    .attr('dy', '.35em')
    .attr('text-anchor', 'end')
    .attr('transform', null)
    .attr('class', function(d) {
      return d.org.replace(/ /g, '');
    })
    .text(function(d) {
      return d.name;
    })
    .filter(function(d) {
      return d.x < width / 2;
    })
    .attr('x', 6 + sankey.nodeWidth())
    .attr('text-anchor', 'start');
}

function resize_svgs() {
  var width = Number(d3.select('.graphic').style('width').slice(0, -2));

  d3.selectAll('svg')
    .attr('width', function(d) {
      if(d3.select(this.parentNode).classed('text-left') == true && width > 513) {
        return 515;
      } else if(d3.select(this.parentNode).classed('text-right') == true && width > 500) {
        return 502;
      }

      return width;
    })
    .attr('height', null);
}
 
window.onresize = function(event) {
  resize_svgs();
}