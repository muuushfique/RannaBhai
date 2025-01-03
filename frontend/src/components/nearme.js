import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../css/NearMe.css';
import axios from 'axios'


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const NearMe = () => {
  const [userLocation, setUserLocation] = useState({
    lat: 23.77326103896032,
    lng: 90.42502754515279
  });
  function toRad(value) {
    return value * Math.PI / 180;
  }
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  const fetchStores = async () => {
    try {
      const response = await axios.get('http://localhost:1240/stores', {
        params: {
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 5 // 5km radius
        }
      });
      
      const processedStores = response.data.map(store => ({
        id: store._id,
        name: store.name,
        address: store.address,
        lat: store.location.coordinates[1],
        lng: store.location.coordinates[0],
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          store.location.coordinates[1],
          store.location.coordinates[0]
        )
      }));
      const storesWithin5km = processedStores.filter(store => store.distance <= 5);
    
      const sortedStores = storesWithin5km.sort((a, b) => a.distance - b.distance);
      setNearbyStores(sortedStores);
      
    } catch (err) {
      console.error('Error fetching stores:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStores();
  }, [userLocation]);
  
  const [nearbyStores, setNearbyStores] = useState([]);
  const [loading, setLoading] = useState(true);


  if (loading) {
    return <div className="loading">Loading stores...</div>;
  }

  return (
    <div className="map-container">
      <h1 className="map-title">Nearby Grocery Stores in Dhaka</h1>
      <div className="map">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '500px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createIcon('red')}
          >
            <Popup>You are here</Popup>
          </Marker>

          {nearbyStores.map(store => (
            <Marker
              key={store.id}
              position={[store.lat, store.lng]}
              icon={createIcon('blue')}
            >
              <Popup>
                <strong>{store.name}</strong><br />
                {store.description}<br />
                Distance: {store.distance.toFixed(2)} km
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="store-list">
        <h2>Nearby Stores ({nearbyStores.length})</h2>
        {nearbyStores.length === 0 ? (
          <p>No grocery stores found within 5km of your location.</p>
        ) : (
          nearbyStores.map(store => (
            <div key={store.id} className="store-item">
              <h3>{store.name}</h3>
              <p>{store.description}</p>
              <span className="distance">{store.distance.toFixed(2)} km away</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NearMe;