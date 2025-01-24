// 'use client';
import styles from "../pages/index.module.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import "./components.css";
import { useState } from "react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type GetAllStores = inferProcedureOutput<AppRouter["stores"]["getAllStores"]>;

const getIcon = (variant: string) => {
  const iconUrls = {
    "Seven Eleven":
      "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFWqN3QVLwdRxWNpQtSrHzm1XfyAM3PiZvuOaj",
    Oxxo: "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFE4phsq3aqAIvldVN765rzGPgCkHSt1OYhDnW",
    "Farmacia Guadalajara":
      "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFxtj5KgEhrDp2LPVXKwAz9QCatcZgd8unUvMT",
    "Farmacia Ahorro":
      "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFAFIF4lWefjC32coJ0VnHKQlMWUE8a7Zi5zYs",
    Autozone:
      "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfFkvMZGSXZEV46qNPIxi7hgdcS0zCR923Qntls",
  };
  // Verifica si la clave existe en iconUrls, usa un ícono por defecto si no
  const iconUrl =
    iconUrls[variant as keyof typeof iconUrls] ||
    "https://qrp3fncp5h.ufs.sh/f/pvcc1agPKRfF8wSaHf5OQIw9D3inxsVuTyRKaoLmNeYEh5W4"; // Valor por defecto

  return new L.Icon({
    iconUrl: iconUrl,
    iconSize: [60, 32], // Tamaño del ícono
    iconAnchor: [32, 10], // Punto del ícono que apunta al marcador
    popupAnchor: [0, -20], // Posición del popup relativo al ícono
  });
};

const Map = ({ storesIM }: { storesIM: GetAllStores }) => {
  const [stores, setStores] = useState<GetAllStores>(storesIM || []);
  useEffect(() => {
    // Esto asegura que solo se renderice en el cliente
    console.log("Leaflet map rendered on client");
    // Actualiza el estado interno si storesIM cambia
    setStores(storesIM || []);
  }, [storesIM]);

  // const { data, isLoading } = api.stores.getAllStores.useQuery();

  // if (isLoading) return <div>Loading...</div>
  // if (!data) return <div>Something went wrong</div>

  // console.log(data);

  return (
    <MapContainer
      center={[26.05, -98.27]}
      zoom={14}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stores[0] !== undefined &&
        stores.map((store) => (
          <Marker
            position={[store.lat, store.lng]}
            key={store.id}
            icon={getIcon(store.storeName)}
          >
            <Popup>
              <div className={styles.storedesc}>{store.storeDesc}</div>
              <div className={styles.productlist}>
                {store.products?.map((product) => (
                  <div key={product.product.id} className={styles.productitem}>
                    <h4 className={styles.productdesc}>
                      {product.product.productDesc}
                    </h4>
                    <div className={styles.productinfoblock}>
                      <h5 className={styles.productinfo}>
                        {product.product.brand}
                      </h5>
                      <h4
                        style={{ marginLeft: "1em" }}
                        className={styles.productinfo}
                      >
                        ${product.price}.00
                      </h4>
                      <h5
                        style={{ marginLeft: "1em" }}
                        className={styles.productinfo}
                      >
                        Cant.: {product.stock}
                      </h5>
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
