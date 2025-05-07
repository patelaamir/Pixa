const ImageKit = require('imagekit');

const imagekit = new ImageKit({
  urlEndpoint: "https://ik.imagekit.io/pixa/",
  publicKey: "",
  privateKey: ""
});

export default function handler(req, res) {
  if (req.method === "GET") {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
