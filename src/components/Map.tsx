// 'use client';
import styles from "../pages/index.module.css";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';
import { api } from '~/utils/api';
import './components.css'

// Fix para los íconos de Leaflet (opcional)
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });


  
  const getIcon = (variant:any) => {
    const iconUrls = {
        'Seven Eleven': 'https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFWqN3QVLwdRxWNpQtSrHzm1XfyAM3PiZvuOaj',
        'Oxxo': 'https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFbJCS8E4IyBFuVqUSol4akZ8XK3wEizn2cPtQ',
        'Farmacia Guadalajara': 'https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFFhWmFebo5PXEFKRy7b6VvH3ifSnujxclZLgs',
      };
    // Verifica si la clave existe en iconUrls, usa un ícono por defecto si no
    const iconUrl = iconUrls[variant as keyof typeof iconUrls] || "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFbJCS8E4IyBFuVqUSol4akZ8XK3wEizn2cPtQ"; // Valor por defecto
  
    return new L.Icon({
      iconUrl: iconUrl,
      iconSize: [32, 32], // Tamaño del ícono
      iconAnchor: [16, 32], // Punto del ícono que apunta al marcador
      popupAnchor: [0, -32], // Posición del popup relativo al ícono
    });
  };
  

const Map = () => {
  useEffect(() => {
    // Esto asegura que solo se renderice en el cliente
    console.log('Leaflet map rendered on client');
  }, []);
    
  const { data, isLoading } = api.stores.getAllStores.useQuery();

  if (isLoading) return <div>Loading...</div>
  if (!data) return <div>Something went wrong</div>

  console.log(data);

//   const { data } = api.storeProducts.getAllStoreProducts.useQuery();

//   if (!data) return <div>Something went wrong</div>

//   console.log(data);

  return (
    <MapContainer center={[26.05, -98.27]} zoom={14} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.map((store)=>(
        <Marker position={[store.lat, store.lng]} key={store.id} icon={getIcon(store.storeName)}>
          <Popup>
            <div className={styles.storedesc}>{store.storeDesc}</div>
            <div className={styles.productlist}>
              {store.products?.map((product)=>(
                <div key={product.product.id} className={styles.productitem}>
                    <h4 className={styles.productdesc}>{product.product.productDesc}</h4>
                    <div className={styles.productinfoblock}>
                        <h5 className={styles.productinfo}>{product.product.brand}</h5>
                        <h4 style={{marginLeft:"1em"}} className={styles.productinfo}>${product.price}.00</h4>
                        <h5 style={{marginLeft:"1em"}} className={styles.productinfo}>Cant.: {product.stock}</h5>
                    </div>
                </div>
              ))}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
