import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
import { useLocation } from 'react-router-dom';
import Globe from 'react-globe.gl';
import 'leaflet/dist/leaflet.css';
import '../styles/Traffic.css';
import L from 'leaflet';

// Chaves de API
const ORS_API_KEY = '5b3ce3597851110001cf6248b35ffe4a602e4377a66c33fa346b8b1e';
const TOMTOM_API_KEY = '3YDGghXPQDfKIQU0JGnvCb2bKGGPyK2B';
const JAWG_API_KEY = 'ZPF7gcpHO7h6ciXCjdt47BqLv6u1XhKrQSgUqVt69NUPGy7XvBAfjP4pHH2XDOVN';

// Ícones personalizados
const customMarkerIcon = new L.Icon({
  iconUrl: require('../Pictures/bonequinhomuitobrabo.gif'),
  iconSize: [58, 58],
  iconAnchor: [34, 58],
  popupAnchor: [0, -48],
});

const destinationMarkerIcon = new L.Icon({
  iconUrl: require('../Pictures/localization.gif'),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapBounds({ coords }) {
  const map = useMap();
  if (coords.length > 0) {
    map.fitBounds(coords);
  }
  return null;
}

function Traffic() {
  const location = useLocation();
  const [routeCoords, setRouteCoords] = useState([]);
  const [travelTime, setTravelTime] = useState(null);
  const [error, setError] = useState(null);
  const [trafficSegments, setTrafficSegments] = useState([]);
  const [showGlobe, setShowGlobe] = useState(true);
  const [pointOfView, setPointOfView] = useState({ lat: 0, lng: 0, altitude: 5 });
  const globeEl = useRef();

  const query = new URLSearchParams(location.search);
  const origin = query.get('origin');
  const destination = query.get('destination');

  const getCoordinates = async (address) => {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error('Endereço não encontrado: ' + address);
  };

  useEffect(() => {
    if (origin && destination) {
      const fetchRoute = async () => {
        try {
          const originCoords = await getCoordinates(origin);
          const destinationCoords = await getCoordinates(destination);
          const midLat = (originCoords[0] + destinationCoords[0]) / 2;
          const midLng = (originCoords[1] + destinationCoords[1]) / 2;
          setPointOfView({ lat: midLat, lng: midLng, altitude: 0.8 });

          const orsUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
          const body = {
            coordinates: [
              [originCoords[1], originCoords[0]],
              [destinationCoords[1], destinationCoords[0]]
            ]
          };

          const res = await fetch(orsUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: ORS_API_KEY,
            },
            body: JSON.stringify(body),
          });

          const data = await res.json();

          if (data.features && data.features.length > 0) {
            const durationSec = data.features[0].properties.summary.duration;
            setTravelTime((durationSec / 60).toFixed(1));
            const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
            setRouteCoords(coords);
            await fetchTrafficSegments(coords);
          } else {
            setError('Rota não encontrada.');
          }
        } catch (err) {
          console.error('Erro ao obter rota:', err);
          setError('Erro ao obter a rota.');
        }
      };

      const fetchTrafficSegments = async (coords) => {
        try {
          const MAX_SEGMENTS = 50;
          const SEGMENT_COUNT = Math.min(coords.length - 1, MAX_SEGMENTS);
          const chunkSize = Math.floor((coords.length - 1) / SEGMENT_COUNT);
          const segmentPromises = [];

          for (let i = 0; i < SEGMENT_COUNT; i++) {
            const startIndex = i * chunkSize;
            const endIndex = (i === SEGMENT_COUNT - 1) ? coords.length - 1 : (i + 1) * chunkSize;
            const segmentCoords = coords.slice(startIndex, endIndex + 1);
            if (segmentCoords.length < 2) continue;
            segmentPromises.push(
              getSegmentTrafficColor(segmentCoords).then(color => ({
                coords: segmentCoords,
                color,
              }))
            );
          }

          const segments = await Promise.all(segmentPromises);
          setTrafficSegments(segments);
        } catch (err) {
          console.error('Erro ao obter dados de tráfego:', err);
        }
      };

      const getSegmentTrafficColor = async (segmentCoords) => {
        try {
          const sampleIndices = [
            0,
            Math.floor(segmentCoords.length / 2),
            segmentCoords.length - 1,
          ];
          const trafficData = await Promise.all(
            sampleIndices.map(idx => getTrafficRatio(segmentCoords[idx]))
          );
          const validRatios = trafficData.filter(r => r !== null);
          const worstRatio = validRatios.length > 0 ? Math.min(...validRatios) : 1;
          if (worstRatio >= 0.95) return 'green';
          if (worstRatio >= 0.8) return 'yellow';
          return 'red';
        } catch (err) {
          console.error('Erro no getSegmentTrafficColor:', err);
          return 'gray';
        }
      };

      const getTrafficRatio = async (coords) => {
        try {
          const [lat, lon] = coords;
          const trafficUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/relative0/10/json?point=${lat},${lon}&key=${TOMTOM_API_KEY}`;

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(trafficUrl, { signal: controller.signal });
          clearTimeout(timeoutId);

          const data = await res.json();
          if (data && data.flowSegmentData) {
            const { currentSpeed, freeFlowSpeed } = data.flowSegmentData;
            return currentSpeed / freeFlowSpeed;
          }
          return null;
        } catch (err) {
          console.error('Erro no getTrafficRatio:', err);
          return null;
        }
      };

      fetchRoute();
    }
  }, [origin, destination]);

  const handleGlobeClick = () => {
    if (globeEl.current) {
      globeEl.current.pointOfView(
        { lat: pointOfView.lat, lng: pointOfView.lng, altitude: 0.1 },
        1500
      );
      setTimeout(() => {
        setShowGlobe(false);
      }, 1500);
    }
  };

  return (
    <div className="traffic-container">
      {showGlobe ? (
        <div className="globe-container" onClick={handleGlobeClick} style={{ cursor: 'pointer' }}>
          <Globe
            ref={globeEl}
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            backgroundColor="#0d0d0d"
            atmosphereColor="#1a5e6d"
            atmosphereAltitude={0.6}
            autoRotate={true}
            autoRotateSpeed={0.03}
            pointOfView={pointOfView}
            transitionDuration={2000}
            showGraticules={true}
            showGlobe={true}
            enablePointerInteraction={true}
            enableZoom={true}
            light={{ intensity: 1.5, position: [2, 2, 3] }}
            shadows={true}
            className="custom-globe"
          />
          <div className="globe-border"></div>
        </div>
      ) : (
        <>
          <div className="traffic-header">
            <h2>Trajeto: {origin} → {destination}</h2>
            {travelTime && <p className="travel-time">Tempo estimado: {travelTime} minutos</p>}
          </div>
          {error && <p className="traffic-error">{error}</p>}
          <div className="map-wrapper fade-in">
            {routeCoords.length > 0 && (
              <MapContainer
                center={routeCoords[0]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%' }}
              >
                <TileLayer
                  url={`https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=${JAWG_API_KEY}`}
                  attribution='&copy; <a href="https://jawg.io">Jawg Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  minZoom={0}
                  maxZoom={22}
                />
                <MapBounds coords={routeCoords} />
                <Polyline pathOptions={{ color: 'blue' }} positions={routeCoords} />
                {trafficSegments.map((segment, idx) => (
                  <Polyline
                    key={idx}
                    pathOptions={{ color: segment.color, weight: 8 }}
                    positions={segment.coords}
                  />
                ))}
                <Marker position={routeCoords[0]} icon={customMarkerIcon}>
                  <Popup>{origin}</Popup>
                </Marker>
                <Marker
                  position={routeCoords[routeCoords.length - 1]}
                  icon={destinationMarkerIcon}
                >
                  <Popup>{destination}</Popup>
                </Marker>
              </MapContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Traffic;