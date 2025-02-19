import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const GujaratMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([72.57, 22.26]), // Approx. center of Gujarat (Longitude, Latitude)
        zoom: 7, // Adjust zoom level as needed
      }),
    });

    return () => map.setTarget(undefined); // Cleanup on unmount
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "600px" }} />;
};

export default GujaratMap;
