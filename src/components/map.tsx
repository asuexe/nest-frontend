import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";
import { Style, Stroke, Fill } from "ol/style";

const geojsonFiles: Record<string, string> = {
  "Project A": "/geoJSON/GMDC.json",
  "Project B": "/geojson/project_b.geojson",
  "Project C": "/geojson/project_c.geojson",
};

interface GujaratMapProps {
  selectedProject: string;
}

const GujaratMap: React.FC<GujaratMapProps> = ({ selectedProject }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);
  const vectorLayerRef = useRef<VectorLayer<VectorSource> | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
      ],
      view: new View({
        center: fromLonLat([72.57, 22.26]), // Gujarat center
        zoom: 7,
      }),
    });

    return () => mapInstance.current?.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (!mapInstance.current || !selectedProject || !geojsonFiles[selectedProject]) return;

    // Remove previous GeoJSON layer if it exists
    if (vectorLayerRef.current) {
      mapInstance.current.removeLayer(vectorLayerRef.current);
    }

    // Load new GeoJSON file
    const vectorSource = new VectorSource({
      url: geojsonFiles[selectedProject],
      format: new GeoJSON(),
    });

    vectorLayerRef.current = new VectorLayer({
      source: vectorSource,
      style: new Style({
        fill: new Fill({ color: "rgba(0, 150, 136, 1)" }),
        stroke: new Stroke({ color: "#009688", width: 2 }),
      }),
    });

    mapInstance.current.addLayer(vectorLayerRef.current);

    vectorSource.once("change", () => {
      if (vectorSource.getState() === "ready") {
        const extent = vectorSource.getExtent();
        mapInstance.current?.getView().fit(extent, { duration: 1000 });
      }
    });
  }, [selectedProject]);

  return <div ref={mapRef} style={{ width: "100%", height: "670px" }} />;
};

export default GujaratMap;
