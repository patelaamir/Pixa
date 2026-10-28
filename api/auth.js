const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || process.env.VITE_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/pixa/",
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || process.env.VITE_IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || ""
});

export default function handler(req, res) {
  if (req.method === "GET") {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
