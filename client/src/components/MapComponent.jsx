import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const MapComponent = ({ preschools = [], center = [20.5937, 78.9629], zoom = 5 }) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        
        {preschools.map((preschool) => (
          preschool.latitude && preschool.longitude && (
            <Marker
              key={preschool.id}
              position={[preschool.latitude, preschool.longitude]}
            >
              <Popup className="preschool-popup">
                <div className="font-semibold text-sm">
                  <h4 className="mb-1">{preschool.name}</h4>
                  <p className="text-xs text-gray-600 mb-1">{preschool.address}</p>
                  {preschool.phone && (
                    <a 
                      href={`tel:${preschool.phone}`}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      {preschool.phone}
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        ))}
      </MapContainer>
    </div>
  );
};
