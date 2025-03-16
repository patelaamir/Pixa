const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/pixa/",
  publicKey: "public_AZOsWS07COGHjErNayUX76zd4Oc=",
  privateKey: "private_2EQ0bY4jMxJhj+xZY4QaFctWCxg="
});

export default function handler(req, res) {
  if (req.method === "GET") {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
