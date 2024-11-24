import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon } from "leaflet";
import marker from "./gopher-hero8.png";

const ICON = icon({
  iconUrl: marker,
  iconSize: [32, 32],
});

export default function Map(props) {
  const position = [props.lat, props.lon];
  const zoom = props.zoom || 13;
  return (
    <MapContainer
      center={position}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker icon={ICON} position={position}>
        <Popup>{props.title}</Popup>
      </Marker>
    </MapContainer>
  );
}
