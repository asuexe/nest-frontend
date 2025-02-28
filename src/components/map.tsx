import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const projectLocations: Record<string, [number, number]> = {
  "Project A": [72.15, 21.77], // Approximate location for Bhavnagar
  "Project B": [72.57, 22.26], // Default Gujarat center
  "Project C": [71.67, 22.83], // Some other location
};

interface GujaratMapProps {
  selectedProject: string;
}

const GujaratMap: React.FC<GujaratMapProps> = ({ selectedProject }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapInstance.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([72.57, 22.26]), // Default center
        zoom: 7,
      }),
    });

    return () => mapInstance.current?.setTarget(undefined);
  }, []);

  useEffect(() => {
    if (mapInstance.current && selectedProject && projectLocations[selectedProject]) {
      mapInstance.current.getView().animate({
        center: fromLonLat(projectLocations[selectedProject]),
        zoom: 12, // Adjust zoom for focus
        duration: 1000,
      });
    }
  }, [selectedProject]);

  return <div ref={mapRef} style={{ width: "100%", height: "670px" }} />;
};

export default GujaratMap;
