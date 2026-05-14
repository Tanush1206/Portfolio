export interface CertificateEntry {
  title: string;
  issuer: string;
  date: string;
  id: string;
  link: string;
  image?: string;
  logo?: string;
}

export const certificates: CertificateEntry[] = [
  {
    title: "Learn JavaScript",
    issuer: "Scrimba",
    date: "FEB 2026",
    id: "SCRIMBA-JS-2026",
    link: "https://scrimba.com/certificate",
    image: "/images/certs/scrimba_js.jpeg",
    logo: "https://files.tolt.io/1713965389561-socialavatar.png"
  },
  {
    title: "Python Course",
    issuer: "Tutedude",
    date: "APR 2026",
    id: "TD-TANU-PY-0908",
    link: "https://tutedude.com/verify",
    image: "/images/certs/tutedude_py.jpeg",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgtsoUhhVZ5dXNqJmc_MnlJ_dHCZr0ZTwLTQ&s"
  }
];
