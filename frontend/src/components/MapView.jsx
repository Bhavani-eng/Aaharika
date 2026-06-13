import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const MapView = ({ lat, lng, address, height = '280px', zoom = 14 }) => {
  if (!lat || !lng) {
    return (
      <div className="bg-background rounded-xl border border-border-light flex items-center justify-center text-text-light text-sm" style={{ height }}>
        <div className="text-center p-6">
          <span className="text-3xl block mb-2 opacity-40">📍</span>
          Location not available
        </div>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-xl overflow-hidden border border-border-light">
      <MapContainer center={[lat, lng]} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={defaultIcon}>
          {address && <Popup>{address}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
};

export const LocationPicker = ({ lat, lng, onLocationChange, address, onAddressChange }) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <label className="text-label block">Pickup Address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => onAddressChange(e.target.value)}
        placeholder="Enter full pickup address"
        className="input-base"
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <label className="text-label block">Latitude</label>
        <input type="number" step="any" value={lat} onChange={(e) => onLocationChange({ lat: parseFloat(e.target.value) || 0, lng })}
          className="input-base" />
      </div>
      <div className="space-y-2">
        <label className="text-label block">Longitude</label>
        <input type="number" step="any" value={lng} onChange={(e) => onLocationChange({ lng: parseFloat(e.target.value) || 0, lat })}
          className="input-base" />
      </div>
    </div>
    {lat && lng ? (
      <MapView lat={lat} lng={lng} address={address} height="240px" />
    ) : (
      <p className="text-xs text-text-light p-3 bg-background rounded-lg">Enter coordinates to preview the map location.</p>
    )}
  </div>
);
