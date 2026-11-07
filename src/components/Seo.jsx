import { Helmet } from "react-helmet-async";

const SITE_NAME = "RiderZ";
const BASE_URL = "https://riderz-team.vercel.app"; 
const DEFAULT_IMAGE = "https://riderz-team.vercel.app/RiderZLogo.webp"; 

export default function Seo({
  title,
  description,
  canonicalPath = "",
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = `${BASE_URL}${canonicalPath}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content="ar_SY" />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}