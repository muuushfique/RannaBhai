import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import api from '../services/api';

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export default function Nearme() {
  const [coords, setCoords] = useState([23.8103, 90.4125]); // Default: Dhaka
  const [radius, setRadius] = useState(15);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locStatus, setLocStatus] = useState('Showing stores around Dhaka');

  const fetchStores = (lat, lon, rad) => {
    setLoading(true);
    api
      .get('/stores', { params: { latitude: lat, longitude: lon, radius: rad } })
      .then((res) => setStores(res.data || []))
      .catch(() => setStores([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStores(coords[0], coords[1], radius);
  }, [coords, radius]);

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation is not supported by your browser.');
      return;
    }
    setLocStatus('Locating you...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next = [pos.coords.latitude, pos.coords.longitude];
        setCoords(next);
        setLocStatus(`Centered on your live coordinates (${next[0].toFixed(3)}, ${next[1].toFixed(3)})`);
      },
      () => {
        setLocStatus('Location access denied — keeping Dhaka default.');
      }
    );
  };

  return (
    <div className="rb-page">
      <div className="rb-page-header">
        <div>
          <div className="rb-eyebrow">Local Market Finder</div>
          <h1 className="rb-title">Grocery Stores Near Me</h1>
          <p className="rb-subtitle">{locStatus}</p>
        </div>
        <button type="button" className="rb-btn rb-btn-primary" onClick={useMyLocation}>
          <Navigation size={15} /> Use My Location
        </button>
      </div>

      <div className="rb-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <label className="rb-label" style={{ margin: 0 }}>
          Search Radius: <strong>{radius} km</strong>
        </label>
        <input
          type="range"
          min="2"
          max="30"
          value={radius}
          onChange={(e) => setRadius(Number(e.target.value))}
          style={{ flex: 1, minWidth: '200px', accentColor: 'var(--accent)' }}
        />
        <span className="rb-badge rb-badge-sage">{stores.length} stores found</span>
      </div>

      <div className="rb-grid-2" style={{ alignItems: 'start' }}>
        <div className="rb-card" style={{ padding: 0, overflow: 'hidden', height: '420px' }}>
          <MapContainer center={coords} zoom={13} style={{ width: '100%', height: '100%' }}>
            <Recenter center={coords} />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {stores.map((s) => (
              <Marker key={s._id} position={[s.latitude, s.longitude]} icon={markerIcon}>
                <Popup>
                  <strong>{s.name}</strong>
                  <br />
                  {s.address}
                  {s.distanceKm != null && (
                    <>
                      <br />
                      <em>{s.distanceKm} km away</em>
                    </>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {loading ? (
            <div className="rb-empty">Loading nearby stores...</div>
          ) : stores.length === 0 ? (
            <div className="rb-empty">No grocery stores found within {radius} km.</div>
          ) : (
            stores.map((store) => (
              <div key={store._id} className="rb-card rb-card-hover" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.12rem', marginBottom: '0.2rem' }}>{store.name}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="var(--accent)" /> {store.address}
                  </p>
                </div>
                {store.distanceKm != null && (
                  <span className="rb-badge rb-badge-accent" style={{ flexShrink: 0 }}>
                    {store.distanceKm} km
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
