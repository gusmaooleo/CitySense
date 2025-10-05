export type Alert = {
  id: number,
  name: string;
  idesh: string;
  areaHa: number;
  severity: string;
  alertType: string;
  coordinates: [number, number];
};

export const riskAlerts: Alert[] = [
  {
    id: 1,
    name: "Rua Unidos Somos Fortes",
    idesh: "ACIMA DE 0,4",
    areaHa: 8.20318251,
    severity: "grave",
    alertType: "heat island",
    coordinates: [-38.40195140320775, -12.904505218813563],
  },
  {
    id: 2,
    name: "Cassange",
    idesh: "MUITO GRAVE",
    areaHa: 23.43672752,
    severity: "muito_grave",
    alertType: "flood",
    coordinates: [-38.368601236630354, -12.902816234294633],
  },
  {
    id: 3,
    name: "Nova Esperança / Barro Duro",
    idesh: "MUITO GRAVE",
    areaHa: 129.65417842,
    severity: "muito_grave",
    alertType: "landslide",
    coordinates: [-38.37566363542704, -12.832626206552542],
  },
  {
    id: 4,
    name: "Planeta dos Macacos / Bela Vista do Aeroporto",
    idesh: "ACIMA DE 0,4",
    areaHa: 14.11557681,
    severity: "grave",
    alertType: "flood",
    coordinates: [-38.35111456868245, -12.913679600118753],
  },
  {
    id: 5,
    name: "Colinas de Mussurunga",
    idesh: "ACIMA DE 0,4",
    areaHa: 41.50844368,
    severity: "grave",
    alertType: "bad air quality",
    coordinates: [-38.36326702731747, -12.915868942389327],
  },
  {
    id: 6,
    name: "Alagados / Uruguai",
    idesh: "MUITO GRAVE",
    areaHa: 315.85157079,
    severity: "muito_grave",
    alertType: "flood",
    coordinates: [-38.49729800663206, -12.93500169100628],
  },
];
