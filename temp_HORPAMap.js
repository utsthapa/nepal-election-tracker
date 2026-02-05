
var map = L.map('map', {
    zoomControl:true,
    maxZoom:12,
    minZoom:6,
    maxBounds: bounds,
    maxBoundsViscosity: 0,
    scrollWheelZoom: false,
}).fitBounds([[26.015724412758683,79.85654405904252],[30.77893181441505,88.40790228836913]]);
// var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');
var bounds_group = new L.featureGroup([]);
map.dragging.disable();

let open_layers = {
    '1': null,
    '2': null,
    '3': null,
    '4': null,
};

let all_layers = {};

var vm;
var fVoterCount = (({MVoters, FVoters, OVoters, TVoters}) => ({ MVoters : MVoters || 0, FVoters : FVoters || 0, OVoters : OVoters || 0, TVoters: TVoters || 0 }));
var fVoteCount = (({ValidVote, InvalidVote, CastedVote}) => ({ValidVote : ValidVote || 0, InvalidVote : InvalidVote || 0, CastedVote : CastedVote || 0}));

const convertToNep = n => [...'' + n].map(x => '०१२३४५६७८९'[x]).join('');



let theme = localStorage.getItem('theme') || 'light';

var southWest = L.latLng(26.015724412758683,79.85654405904252),
northEast = L.latLng(30.77893181441505,88.40790228836913);
var bounds = L.latLngBounds(southWest, northEast);

let layers = [
    {
        name: 'states',
        file: 'Province',
        id: 'STATE_C',
        tooltip: 'STATE_N',
        // color: '#9dc4d7',
        color: '#d2d5fe',
        weight: 1.6,
        showTooltip: true,
        hasChildren: true,
        loadData: false,
        idfn: x => x.STATE_C,
    },
    {
        name: 'districts',
        prefix: 'District/STATE_C_',
        id: 'DCODE',
        tooltip: 'DISTRICT_N',
        // color: '#d79d9d',
        color: '#ffd3d4',
        weight: .75,
        showTooltip: true,
        hasChildren: true,
        loadData: false,
        idfn: x => x.STATE_C + '.' + x.DCODE,
    },
    {
        name: 'Constituencies',
        prefix: 'Const/dist-',
        id: 'F_CONST',
        id0: 'DCODE',
        tooltip: 'F_CONST',
        tooltipfn: convertToNep,
        // color: '#a4d79d',
        color: '#d0feda',
        weight: .2,
        showTooltip: true,
        hasChildren: true,
        loadData: true,
        idfn: x => x.STATE_C + '.' + x.DCODE + '.' + x.F_CONST,
    },
    {
        name: 'sub-Constituencies',
        prefix: 'pa/const-',
        id: 'P_CONST',
        tooltip: 'P_CONST',
        tooltipfn: convertToNep,
        // color: '#a4d79d',
        color: '#96ece4',
        weight: .1,
        showTooltip: true,
        hasChildren: false,
        loadData: true,
        GetFconst:true,
        idfn: x => x.STATE_C + '.' + x.DCODE + '.' + x.F_CONST + '.' + x.P_CONST,
    },
];

const openLayer = (layer, level) => {
    Object.keys(open_layers).filter(y => +y > level).map(lvl => {
        if (open_layers[lvl]) {
            let oldLayer = open_layers[lvl];
            map.removeLayer(oldLayer);
            open_layers[lvl] = null;
        }
    });
    let lvlLayer = layers[level];
    let id0 = lvlLayer.id0 ? layer.feature.properties[lvlLayer.id0] : null;
    let id = layer.feature.properties[lvlLayer.id];

    /*
    let tt = layer.getTooltip();
    layer.unbindTooltip().bindTooltip(tt, {
        permanent: false,
    });
    */

    let rmLayer = open_layers[level];
    if (rmLayer) {
        let rmTooltip = rmLayer.getTooltip();            
        rmLayer.unbindTooltip().bindTooltip(rmTooltip, {
            permanent: true,
        });
    }

    //localStorage.removeItem("constId");
	map.fitBounds(layer.getBounds());
    if (lvlLayer.hasChildren) {
        genLayer(level + 1, (id0 ? id0 + '-' : '') + id);
    }
            
    if (lvlLayer.loadData) {
        vm.LoadData();
        // vm.disp(layer.feature.properties);
    }
};

function onEachFeature (level) {
    return (feature, layer) => {
        let lvlLayer = layers[level];
        let id0 = lvlLayer.id0 ? feature.properties[lvlLayer.id0] : null;
        let id = feature.properties[lvlLayer.id];
        let color = lvlLayer.color;

        let className = id == 5999 ? "map-tooltip-state-dark" : "map-tooltip-state";
        if (id == 5999) {
            color = '#2f480a';
            layer.setStyle({
                fillColor: color,
            });
        }

        let tooltipText = feature.properties[lvlLayer.tooltip];
        if (tooltipText == '5999') tooltipText = '';
        if (lvlLayer.tooltipfn) tooltipText = lvlLayer.tooltipfn(tooltipText);
        if(lvlLayer.GetFconst){
            var fconst=localStorage.getItem('constId');
            var ttip= convertToNep(fconst) + '(' + tooltipText + ')';
            tooltipText = ttip;
        }

        layer.id = lvlLayer.idfn(feature.properties);
        all_layers[lvlLayer.idfn(feature.properties)] = layer;

        layer.bindTooltip('' + tooltipText, {permanent: lvlLayer.showTooltip, className, offset: [0, 0], direction: "center" });

        layer.on('click', (e) => {
            if (level == 0) {
                vm.state(layer.feature.properties.STATE_C);
            } else if (level == 1) {
                vm.district(layer.feature.properties.DCODE);
                vm.fConst(null);
                vm.pConst(null);
            } else if (level == 2) {
                vm.fConst(layer.feature.properties.F_CONST);
                vm.pConst(null);
                localStorage.setItem("constId", vm.fConst());
            } else if (level == 3) {
                vm.pConst(layer.feature.properties.P_CONST);
            }
            // openLayer(layer, level);
        });

        layer.on('mouseover', (e) => {
            layer.setStyle({
                fillColor: id == 5999 ? '#162204' : '#f8f8ba',
            });
            if (!lvlLayer.showTooltip) {
                let rmTooltip = layer.getTooltip();            
                layer.unbindTooltip().bindTooltip(rmTooltip, {
                    permanent: true,
                });
            }
        });

        layer.on('mouseout', (e) => {
            layer.setStyle({
                fillColor: color,
            });
            if (!lvlLayer.showTooltip) {
                let rmTooltip = layer.getTooltip();            
                layer.unbindTooltip().bindTooltip(rmTooltip, {
                    permanent: false,
                });
            }
        });
    };
}

function genStyle (level) {
    return (layer) => {
        return {
            pane: 'states',
            opacity: 1,
            color: '#000',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: layers[level].weight, 
            fill: true,
            fillOpacity: 1,
            fillColor: layers[level].color,
            interactive: true,
        }
    };
}

genLayer = (level, data = null) => {
    let layerName = layers[level].name;
    let jsonFile = level == 0 ? layers[level].file + '.json' : layers[level].prefix + data + '.json';
    map.createPane('states');
    map.getPane('states').style.zIndex = 4 - level;
    map.getPane('states').style['mix-blend-mode'] = 'normal';

    $.getJSON('/JSONFiles/JSONMap/geojson/' + jsonFile, data => {
        var state_layer = new L.geoJson(data, {
            attribution: '',
            interactive: true,
            dataVar: layerName,
            layerName: 'layer_' + layerName,
            pane: layerName,
            onEachFeature: onEachFeature(level),
            style: genStyle(level),
        });
        bounds_group.addLayer(state_layer);
        map.addLayer(state_layer);
        open_layers[level] = state_layer;
        /*
        Object.keys(open_layers).filter(x => x != level && open_layers[x]).forEach(layer => {
            console.log(layer);
            let tooltip = layer.getTooltip(); 
            layer.unbindTooltip().bindTooltip(tooltip, {
                permanent: true,
            });
        });
        */
    });
};

genLayer(0);