import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createDivIcon = (color = '#06b6d4', label = '') => {
  const html = `
    <div class="custom-div-icon" style="display:inline-block">
      <div class="marker-pin" style="background:${color}"></div>
      <div class="marker-label">${label}</div>
    </div>
  `;
  return L.divIcon({ html, className: 'custom-marker', iconSize: [30, 42], iconAnchor: [15, 42], popupAnchor: [0, -36] });
};

function SetViewOnClick({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center]);
  return null;
}

export const MarkerClusterLayer = ({ preschools, createDivIcon, onSelect }) => {
  const map = useMap();
  const markersRef = useRef(null);

  useEffect(() => {
    if (!map) return;

    // create a marker cluster group
    const markerCluster = L.markerClusterGroup({ chunkedLoading: true });

    // build markers and add to cluster
    preschools.forEach((preschool) => {
      if (!preschool.latitude || !preschool.longitude) return;
      const marker = L.marker([preschool.latitude, preschool.longitude], {
        icon: createDivIcon(preschool.verified_status ? '#10b981' : '#06b6d4', (preschool.name || '').split(' ').slice(0,2).map(w=>w[0]).join('')),
      });

      const popupHtml = `
        <div class="font-semibold text-sm">
          <div class="mb-1">${preschool.name}</div>
          <div class="text-xs text-gray-600 mb-1">${preschool.address || ''}</div>
          ${preschool.phone ? `<a href="tel:${preschool.phone}" class="text-xs text-blue-600 hover:underline">${preschool.phone}</a>` : ''}
        </div>
      `;

      marker.bindPopup(popupHtml, { minWidth: 160 });

      marker.on('click', () => onSelect(preschool));

      markerCluster.addLayer(marker);
    });

    map.addLayer(markerCluster);

    // store ref to cleanup later
    markersRef.current = markerCluster;

    return () => {
      if (markersRef.current) {
        map.removeLayer(markersRef.current);
        markersRef.current = null;
      }
    };
  }, [map, preschools]);

  return null;
};

export const MapComponent = ({ preschools = [], center = [20.5937, 78.9629], zoom = 5, showOverlay = true }) => {
  const [selected, setSelected] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const handleSelect = (preschool) => {
    setSelected(preschool);
    if (mapRef.current) {
      mapRef.current.flyTo([preschool.latitude, preschool.longitude], 13, { duration: 0.6 });
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Marker clustering: use Leaflet.markercluster to handle many markers efficiently */}
        <MarkerClusterLayer
          preschools={preschools}
          createDivIcon={createDivIcon}
          onSelect={handleSelect}
        />

        {selected && <SetViewOnClick center={[selected.latitude, selected.longitude]} />}
      </MapContainer>

      {showOverlay && selected && (
        <div className="absolute bottom-4 right-4 w-80"> 
          <div className="card p-3">
            <div className="flex items-start gap-3">
              <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                <img src={selected.images?.[0]?.image_url || ''} alt={selected.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{selected.name}</h4>
                <p className="text-xs text-gray-600 line-clamp-2">{selected.address}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => navigate(`/preschool/${selected.id}`)} className="btn-outline text-xs py-1 px-3">View Details</button>
                  <button onClick={() => setSelected(null)} className="btn-secondary text-xs py-1 px-3">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
